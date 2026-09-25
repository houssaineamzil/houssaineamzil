import { asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { projects as projectsTable } from "@/lib/db/schema";
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

export async function upsertProject(
  input: ProjectInput,
): Promise<ProjectType & { id: string }> {
  if (!input.slug.trim()) {
    throw new Error("slug must not be empty");
  }

  const existingBySlug = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, input.slug))
    .limit(1);

  if (existingBySlug.length > 0 && existingBySlug[0]?.id !== input.id) {
    throw new Error(`slug "${input.slug}" is already in use`);
  }

  const values = {
    slug: input.slug,
    name: input.name,
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
    return { ...toProjectType(row), id: row.id };
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

  return { ...toProjectType(row), id: row.id };
}

export async function deleteProject(id: string): Promise<void> {
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const rows = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(inArray(projectsTable.id, orderedIds));

  const validIds = new Set(rows.map((r) => r.id));

  await Promise.all(
    orderedIds
      .filter((id) => validIds.has(id))
      .map((id, index) =>
        db
          .update(projectsTable)
          .set({ sortOrder: index })
          .where(eq(projectsTable.id, id)),
      ),
  );
}
