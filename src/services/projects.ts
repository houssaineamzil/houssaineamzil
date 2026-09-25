import { asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects as projectsTable } from "@/lib/db/schema";
import { assertPersistableUrl } from "@/lib/utils";
import type { MediaType, ProjectType } from "@/types";

export interface ProjectInput {
  slug: string;
  name: string;
  type: string;
  description: string;
  labels: string[];
  year: string;
  role: string;
  image: MediaType;
  gallery: MediaType[];
  horizontal: boolean;
  id?: string;
}

function toProjectType(row: typeof projectsTable.$inferSelect): ProjectType {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    type: row.type,
    description: row.description,
    labels: row.labels,
    year: row.year,
    role: row.role,
    image: { url: row.imageUrl, alt: row.imageAlt },
    gallery: row.gallery,
    works: { horizontal: row.horizontal },
  };
}

export async function getProjects(): Promise<ProjectType[]> {
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder));
  return rows.map(toProjectType);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectType | null> {
  const [row] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  return row ? toProjectType(row) : null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function upsertProject(
  input: ProjectInput,
): Promise<ProjectType & { id: string }> {
  const slug = input.slug.trim();
  const name = input.name.trim();

  if (!slug) {
    throw new Error("slug must not be empty");
  }
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `slug "${slug}" must contain only lowercase letters, numbers, and hyphens (e.g. "my-project")`,
    );
  }
  if (!name) {
    throw new Error("name must not be empty");
  }
  assertPersistableUrl(input.image.url, "hero image");
  for (const [index, item] of input.gallery.entries()) {
    assertPersistableUrl(item.url, `gallery item ${index + 1}`);
    if (item.poster) {
      assertPersistableUrl(item.poster, `gallery item ${index + 1} poster`);
    }
  }

  const existingBySlug = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);

  if (existingBySlug.length > 0 && existingBySlug[0]?.id !== input.id) {
    throw new Error(`slug "${slug}" is already in use`);
  }

  const values = {
    slug,
    name,
    type: input.type,
    description: input.description,
    labels: input.labels,
    year: input.year,
    role: input.role,
    imageUrl: input.image.url,
    imageAlt: input.image.alt,
    gallery: input.gallery,
    horizontal: input.horizontal,
    updatedAt: new Date(),
  };

  if (input.id) {
    const [row] = await db
      .update(projectsTable)
      .set(values)
      .where(eq(projectsTable.id, input.id))
      .returning();
    if (!row) {
      throw new Error(`project "${input.id}" not found`);
    }
    return toProjectType(row) as ProjectType & { id: string };
  }

  const [maxOrderResult] = await db
    .select({
      maxOrder: sql<number>`coalesce(max(${projectsTable.sortOrder}), -1)`,
    })
    .from(projectsTable);
  const maxOrder = maxOrderResult?.maxOrder ?? -1;

  // A single-row insert() always returns exactly one row.
  const [row] = await db
    .insert(projectsTable)
    .values({ ...values, sortOrder: maxOrder + 1 })
    .returning();
  if (!row) {
    throw new Error("insert did not return a row");
  }

  return toProjectType(row) as ProjectType & { id: string };
}

export async function deleteProject(id: string): Promise<void> {
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  await db.transaction(async (tx) => {
    const rows = await tx
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(inArray(projectsTable.id, orderedIds));

    const validIds = new Set(rows.map((r) => r.id));

    for (const [index, id] of orderedIds.entries()) {
      if (!validIds.has(id)) continue;
      await tx
        .update(projectsTable)
        .set({ sortOrder: index })
        .where(eq(projectsTable.id, id));
    }
  });
}
