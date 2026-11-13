import { asc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";
import type { CollectionKind } from "@/lib/collections";
import { db } from "@/lib/db/client";
import { experiments, projects } from "@/lib/db/schema";
import { assertOneOf, PROJECT_TYPES, ROLES } from "@/lib/projectOptions";
import { assertPersistableUrl } from "@/lib/utils";
import type { ProjectType, StoredProject } from "@/types";

export type ProjectInput = Omit<ProjectType, "id"> & { id?: string };

type Row = typeof projects.$inferSelect;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toProject = (row: Row): StoredProject => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  strategy: row.strategy,
  result: row.result,
  impact: row.impact,
  year: row.year,
  role: row.role,
  projectType: row.projectType,
  url: row.url,
  designer: row.designer,
  developer: row.developer,
  image: { url: row.imageUrl, alt: row.imageAlt },
  gallery: row.gallery,
  horizontal: row.horizontal,
});

/** Throws a user-readable error for anything the editor shouldn't save. */
function validate(input: ProjectInput): void {
  if (!input.slug) throw new Error("slug must not be empty");
  if (!SLUG_PATTERN.test(input.slug)) {
    throw new Error(
      `slug "${input.slug}" must contain only lowercase letters, numbers, and hyphens (e.g. "my-project")`,
    );
  }
  if (!input.name) throw new Error("name must not be empty");
  assertOneOf(input.projectType, PROJECT_TYPES, "project type");
  assertOneOf(input.role, ROLES, "role");
  if (input.url && !/^https?:\/\/\S+$/i.test(input.url)) {
    throw new Error("url must start with http:// or https://");
  }
  assertPersistableUrl(input.image.url, "hero image");
  for (const [index, item] of input.gallery.entries()) {
    assertPersistableUrl(item.url, `gallery item ${index + 1}`);
    if (item.poster) {
      assertPersistableUrl(item.poster, `gallery item ${index + 1} poster`);
    }
  }
}

// `projects` and `experiments` share one column set (see schema.ts), so one
// implementation serves both.
function createCollection(table: typeof projects) {
  // React's per-request memoisation: a project page reads the list for its
  // prev/next links and again for its metadata, but hits the DB once.
  const getAll = cache(async (): Promise<StoredProject[]> => {
    const rows = await db.select().from(table).orderBy(asc(table.sortOrder));
    return rows.map(toProject);
  });

  async function getBySlug(slug: string): Promise<StoredProject | null> {
    return (await getAll()).find((p) => p.slug === slug) ?? null;
  }

  async function upsert(rawInput: ProjectInput): Promise<StoredProject> {
    const input = {
      ...rawInput,
      slug: rawInput.slug.trim(),
      name: rawInput.name.trim(),
      url: rawInput.url.trim(),
      designer: rawInput.designer.trim(),
      developer: rawInput.developer.trim(),
    };
    validate(input);

    const [existingBySlug] = await db
      .select({ id: table.id })
      .from(table)
      .where(eq(table.slug, input.slug))
      .limit(1);
    if (existingBySlug && existingBySlug.id !== input.id) {
      throw new Error(`slug "${input.slug}" is already in use`);
    }

    const values = {
      slug: input.slug,
      name: input.name,
      description: input.description,
      strategy: input.strategy,
      result: input.result,
      impact: input.impact,
      year: input.year,
      role: input.role,
      projectType: input.projectType,
      url: input.url,
      designer: input.designer,
      developer: input.developer,
      imageUrl: input.image.url,
      imageAlt: input.image.alt,
      gallery: input.gallery,
      horizontal: input.horizontal,
      updatedAt: new Date(),
    };

    const [row] = input.id
      ? await db
          .update(table)
          .set(values)
          .where(eq(table.id, input.id))
          .returning()
      : await db
          .insert(table)
          .values({
            ...values,
            // Appended last, computed inside the INSERT so two saves can't
            // read the same max.
            sortOrder: sql`(select coalesce(max(${table.sortOrder}), -1) + 1 from ${table})`,
          })
          .returning();
    if (!row) throw new Error(`project "${input.id}" not found`);
    return toProject(row);
  }

  async function remove(id: string): Promise<void> {
    await db.delete(table).where(eq(table.id, id));
  }

  /** Renumbers the given ids 0..n-1; ids that don't exist are ignored. */
  async function reorder(orderedIds: string[]): Promise<void> {
    if (orderedIds.length === 0) return;
    const position = sql.join(
      orderedIds.map((id, index) => sql`when ${id}::uuid then ${index}::int`),
      sql` `,
    );
    await db
      .update(table)
      .set({ sortOrder: sql`case ${table.id} ${position} end` })
      .where(inArray(table.id, orderedIds));
  }

  return { getAll, getBySlug, upsert, remove, reorder };
}

const byKind = {
  works: createCollection(projects),
  experiments: createCollection(experiments),
};

export const getCollection = (kind: CollectionKind) => byKind[kind];
