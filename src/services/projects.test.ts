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
    expect(all[0].slug).toBe("test-project");
  });

  it("rejects an empty slug", async () => {
    await expect(upsertProject({ ...baseInput, slug: "" })).rejects.toThrow(
      /slug/i,
    );
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
    await deleteProject(created.id as unknown as string);
    expect(await getProjects()).toHaveLength(0);
  });

  it("renumbers sortOrder contiguously on reorder, even with gaps", async () => {
    const a = await upsertProject({ ...baseInput, slug: "a" });
    const b = await upsertProject({ ...baseInput, slug: "b" });
    const c = await upsertProject({ ...baseInput, slug: "c" });
    await deleteProject(b.id as unknown as string);

    await reorderProjects([c.id as unknown as string, a.id as unknown as string]);

    const all = await getProjects();
    expect(all.map((p) => p.slug)).toEqual(["c", "a"]);
  });
});
