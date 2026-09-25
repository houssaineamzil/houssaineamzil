import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import { projects as projectsTable } from "@/lib/db/schema";
import {
  deleteProject,
  getProjectBySlug,
  getProjects,
  reorderProjects,
  upsertProject,
} from "./projects";

const baseInput = {
  slug: "test-project",
  name: "Test Project",
  type: "",
  description: "",
  labels: [] as string[],
  year: "2026",
  role: "",
  image: { url: "/x.avif", alt: "" },
  gallery: [],
  horizontal: false,
};

beforeEach(async () => {
  await db.delete(projectsTable);
});

afterAll(async () => {
  await db.delete(projectsTable);
});

describe("projects service", () => {
  it("creates and lists a project", async () => {
    await upsertProject(baseInput);
    const all = await getProjects();
    expect(all).toHaveLength(1);
    expect(all[0]?.slug).toBe("test-project");
  });

  it("rejects an empty slug", async () => {
    await expect(upsertProject({ ...baseInput, slug: "" })).rejects.toThrow(
      /slug/i,
    );
  });

  it("rejects a whitespace-only slug", async () => {
    await expect(upsertProject({ ...baseInput, slug: "   " })).rejects.toThrow(
      /slug/i,
    );
  });

  it("rejects a slug with characters that would break a URL path", async () => {
    await expect(
      upsertProject({ ...baseInput, slug: "a/b c?" }),
    ).rejects.toThrow(/slug/i);
  });

  it("rejects a whitespace-only name", async () => {
    await expect(upsertProject({ ...baseInput, name: "   " })).rejects.toThrow(
      /name/i,
    );
  });

  it("trims a name with surrounding whitespace", async () => {
    const created = await upsertProject({ ...baseInput, name: "  Test  " });
    expect(created.name).toBe("Test");
  });

  it("rejects a duplicate slug", async () => {
    await upsertProject(baseInput);
    await expect(upsertProject(baseInput)).rejects.toThrow(/slug/i);
  });

  it("fetches by slug", async () => {
    await upsertProject(baseInput);
    const found = await getProjectBySlug("test-project");
    expect(found?.name).toBe("Test Project");
    expect(await getProjectBySlug("missing")).toBeNull();
  });

  it("deletes a project", async () => {
    const created = await upsertProject(baseInput);
    await deleteProject(created.id);
    expect(await getProjects()).toHaveLength(0);
  });

  it("renumbers sortOrder contiguously on reorder, even with gaps", async () => {
    const a = await upsertProject({ ...baseInput, slug: "a" });
    const b = await upsertProject({ ...baseInput, slug: "b" });
    const c = await upsertProject({ ...baseInput, slug: "c" });
    await deleteProject(b.id);

    await reorderProjects([c.id, a.id]);

    const all = await getProjects();
    expect(all.map((p) => ({ slug: p.slug, id: p.id }))).toEqual([
      { slug: "c", id: c.id },
      { slug: "a", id: a.id },
    ]);
    // The actual sortOrder values, not just the resulting list order —
    // a partial/stale reorder submission must not leave duplicate values.
    const rows = await db
      .select({ slug: projectsTable.slug, sortOrder: projectsTable.sortOrder })
      .from(projectsTable)
      .orderBy(projectsTable.sortOrder);
    expect(rows).toEqual([
      { slug: "c", sortOrder: 0 },
      { slug: "a", sortOrder: 1 },
    ]);
  });
});
