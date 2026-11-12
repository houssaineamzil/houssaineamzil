import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import {
  experiments as experimentsTable,
  projects as projectsTable,
} from "@/lib/db/schema";
import {
  deleteProject,
  experimentsCollection,
  getProjectBySlug,
  getProjects,
  reorderProjects,
  upsertProject,
} from "./projects";

const baseInput = {
  slug: "test-project",
  name: "Test Project",
  description: "",
  year: "2026",
  role: "",
  image: { url: "/x.avif", alt: "" },
  gallery: [],
  horizontal: false,
};

beforeEach(async () => {
  await db.delete(projectsTable);
  await db.delete(experimentsTable);
});

afterAll(async () => {
  await db.delete(projectsTable);
  await db.delete(experimentsTable);
});

describe("projects service", () => {
  it("creates and lists a project", async () => {
    await upsertProject(baseInput);
    const all = await getProjects();
    expect(all).toHaveLength(1);
    expect(all[0]?.slug).toBe("test-project");
  });

  it("stores optional strategy, result and impact, empty by default", async () => {
    const plain = await upsertProject(baseInput);
    expect([plain.strategy, plain.result, plain.impact]).toEqual(["", "", ""]);

    const full = await upsertProject({
      ...baseInput,
      slug: "with-case-study",
      strategy: "How",
      result: "What",
      impact: "So what",
    });
    const stored = await getProjectBySlug(full.slug);
    expect([stored?.strategy, stored?.result, stored?.impact]).toEqual([
      "How",
      "What",
      "So what",
    ]);
  });

  it("stores type, url, roles and optional collaborators", async () => {
    const saved = await upsertProject({
      ...baseInput,
      projectType: "Website",
      url: " https://example.com ",
      role: "Designer",
      designer: "Jane",
    });
    expect(saved.projectType).toBe("Website");
    expect(saved.url).toBe("https://example.com");
    expect(saved.role).toBe("Designer");
    expect([saved.designer, saved.developer]).toEqual(["Jane", ""]);
  });

  it("rejects an unknown type, role or non-http url", async () => {
    await expect(
      upsertProject({ ...baseInput, projectType: "Podcast" }),
    ).rejects.toThrow(/type/i);
    await expect(
      upsertProject({ ...baseInput, role: "Wizard" }),
    ).rejects.toThrow(/role/i);
    await expect(
      upsertProject({ ...baseInput, url: "javascript:alert(1)" }),
    ).rejects.toThrow(/url/i);
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

  it("rejects a local blob: URL as the hero image", async () => {
    await expect(
      upsertProject({
        ...baseInput,
        image: { url: "blob:http://localhost/abc-123", alt: "" },
      }),
    ).rejects.toThrow(/blob:/);
  });

  it("rejects a local blob: URL in the gallery", async () => {
    await expect(
      upsertProject({
        ...baseInput,
        gallery: [{ url: "blob:http://localhost/xyz-456", alt: "" }],
      }),
    ).rejects.toThrow(/blob:/);
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

  it("keeps works and experiments in separate lists", async () => {
    await upsertProject({ ...baseInput, slug: "a-work" });
    await experimentsCollection.upsert({ ...baseInput, slug: "an-experiment" });

    expect((await getProjects()).map((p) => p.slug)).toEqual(["a-work"]);
    expect((await experimentsCollection.getAll()).map((p) => p.slug)).toEqual([
      "an-experiment",
    ]);
    expect(await getProjectBySlug("an-experiment")).toBeNull();
    expect(await experimentsCollection.getBySlug("a-work")).toBeNull();
  });

  it("allows the same slug in works and experiments", async () => {
    await upsertProject({ ...baseInput, slug: "same" });
    await expect(
      experimentsCollection.upsert({ ...baseInput, slug: "same" }),
    ).resolves.toBeDefined();
  });
});
