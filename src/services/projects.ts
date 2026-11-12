import { asc, eq, inArray, sql } from "drizzle-orm";
import type { CollectionKind } from "@/lib/collections";
import { db } from "@/lib/db/client";
import {
  experiments as experimentsTable,
  projects as projectsTable,
} from "@/lib/db/schema";
import { PROJECT_TYPES, ROLES } from "@/lib/projectOptions";
import { assertPersistableUrl } from "@/lib/utils";
import type { MediaType, ProjectType } from "@/types";

export interface ProjectInput {
  slug: string;
  name: string;
  description: string;
  strategy?: string;
  result?: string;
  impact?: string;
  year: string;
  role: string;
  projectType?: string;
  url?: string;
  designer?: string;
  developer?: string;
  image: MediaType;
  gallery: MediaType[];
  horizontal: boolean;
  id?: string;
}

type Row = typeof projectsTable.$inferSelect;

function toProjectType(row: Row): ProjectType {
  return {
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
    works: { horizontal: row.horizontal },
  };
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// `projects` and `experiments` are built from the same column set (see
// schema.ts), so one implementation serves both; the cast only unifies the
// two table types, which differ by name alone.
function createCollection(table: typeof projectsTable) {
  async function getAll(): Promise<ProjectType[]> {
    const rows = await db.select().from(table).orderBy(asc(table.sortOrder));
    return rows.map(toProjectType);
  }

  async function getBySlug(slug: string): Promise<ProjectType | null> {
    const [row] = await db
      .select()
      .from(table)
      .where(eq(table.slug, slug))
      .limit(1);
    return row ? toProjectType(row) : null;
  }

  async function upsert(
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
    const projectType = input.projectType ?? "";
    if (
      projectType &&
      !(PROJECT_TYPES as readonly string[]).includes(projectType)
    ) {
      throw new Error(
        `project type "${projectType}" is not one of: ${PROJECT_TYPES.join(", ")}`,
      );
    }
    if (input.role && !(ROLES as readonly string[]).includes(input.role)) {
      throw new Error(
        `role "${input.role}" is not one of: ${ROLES.join(", ")}`,
      );
    }
    const url = (input.url ?? "").trim();
    if (url && !/^https?:\/\/\S+$/.test(url)) {
      throw new Error("url must start with http:// or https://");
    }
    assertPersistableUrl(input.image.url, "hero image");
    for (const [index, item] of input.gallery.entries()) {
      assertPersistableUrl(item.url, `gallery item ${index + 1}`);
      if (item.poster) {
        assertPersistableUrl(item.poster, `gallery item ${index + 1} poster`);
      }
    }

    const existingBySlug = await db
      .select({ id: table.id })
      .from(table)
      .where(eq(table.slug, slug))
      .limit(1);

    if (existingBySlug.length > 0 && existingBySlug[0]?.id !== input.id) {
      throw new Error(`slug "${slug}" is already in use`);
    }

    const values = {
      slug,
      name,
      description: input.description,
      strategy: input.strategy ?? "",
      result: input.result ?? "",
      impact: input.impact ?? "",
      year: input.year,
      role: input.role,
      projectType: input.projectType ?? "",
      url: url,
      designer: (input.designer ?? "").trim(),
      developer: (input.developer ?? "").trim(),
      imageUrl: input.image.url,
      imageAlt: input.image.alt,
      gallery: input.gallery,
      horizontal: input.horizontal,
      updatedAt: new Date(),
    };

    if (input.id) {
      const [row] = await db
        .update(table)
        .set(values)
        .where(eq(table.id, input.id))
        .returning();
      if (!row) {
        throw new Error(`project "${input.id}" not found`);
      }
      return toProjectType(row) as ProjectType & { id: string };
    }

    const [maxOrderResult] = await db
      .select({
        maxOrder: sql<number>`coalesce(max(${table.sortOrder}), -1)`,
      })
      .from(table);
    const maxOrder = maxOrderResult?.maxOrder ?? -1;

    // A single-row insert() always returns exactly one row.
    const [row] = await db
      .insert(table)
      .values({ ...values, sortOrder: maxOrder + 1 })
      .returning();
    if (!row) {
      throw new Error("insert did not return a row");
    }

    return toProjectType(row) as ProjectType & { id: string };
  }

  async function remove(id: string): Promise<void> {
    await db.delete(table).where(eq(table.id, id));
  }

  async function reorder(orderedIds: string[]): Promise<void> {
    await db.transaction(async (tx) => {
      const rows = await tx
        .select({ id: table.id })
        .from(table)
        .where(inArray(table.id, orderedIds));

      const validIds = new Set(rows.map((r) => r.id));

      for (const [index, id] of orderedIds.entries()) {
        if (!validIds.has(id)) continue;
        await tx
          .update(table)
          .set({ sortOrder: index })
          .where(eq(table.id, id));
      }
    });
  }

  return { getAll, getBySlug, upsert, remove, reorder };
}

export const worksCollection = createCollection(projectsTable);
export const experimentsCollection = createCollection(
  experimentsTable as unknown as typeof projectsTable,
);

export function getCollection(kind: CollectionKind) {
  return kind === "experiments" ? experimentsCollection : worksCollection;
}

// Works keep their original names; experiments are reached through
// `experimentsCollection` or `getCollection("experiments")`.
export const getProjects = worksCollection.getAll;
export const getProjectBySlug = worksCollection.getBySlug;
export const upsertProject = worksCollection.upsert;
export const deleteProject = worksCollection.remove;
export const reorderProjects = worksCollection.reorder;
