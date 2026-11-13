import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import {
  experiments as experimentsTable,
  projects as projectsTable,
} from "@/lib/db/schema";
import { getCollection } from "./projects";

const works = getCollection("works");
const experiments = getCollection("experiments");

const baseInput = {
  slug: "test-project",
  name: "Test Project",
  description: "",
  strategy: "",
  result: "",
  impact: "",
  year: "2026",
  role: "",
  projectType: "",
  url: "",
  designer: "",
  developer: "",
  image: { url: "/x.avif", alt: "" },
  gallery: [] as { url: string; alt: string }[],
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
    await works.upsert(baseInput);
    const all = await works.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]?.slug).toBe("test-project");
  });

  it("stores optional strategy, result and impact, empty by default", async () => {
    const plain = await works.upsert(baseInput);
    expect([plain.strategy, plain.result, plain.impact]).toEqual(["", "", ""]);

    const full = await works.upsert({
      ...baseInput,
      slug: "with-case-study",
      strategy: "How",
      result: "What",
      impact: "So what",
    });
    const stored = await works.getBySlug(full.slug);
    expect([stored?.strategy, stored?.result, stored?.impact]).toEqual([
      "How",
      "What",
      "So what",
    ]);
  });

  it("stores type, url, roles and optional collaborators", async () => {
    const saved = await works.upsert({
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
      works.upsert({ ...baseInput, projectType: "Podcast" }),
    ).rejects.toThrow(/type/i);
    await expect(
      works.upsert({ ...baseInput, role: "Wizard" }),
    ).rejects.toThrow(/role/i);
    await expect(
      works.upsert({ ...baseInput, url: "javascript:alert(1)" }),
    ).rejects.toThrow(/url/i);
  });

  it("rejects an empty slug", async () => {
    await expect(works.upsert({ ...baseInput, slug: "" })).rejects.toThrow(
      /slug/i,
    );
  });

  it("rejects a whitespace-only slug", async () => {
    await expect(works.upsert({ ...baseInput, slug: "   " })).rejects.toThrow(
      /slug/i,
    );
  });

  it("rejects a slug with characters that would break a URL path", async () => {
    await expect(
      works.upsert({ ...baseInput, slug: "a/b c?" }),
    ).rejects.toThrow(/slug/i);
  });

  it("rejects a whitespace-only name", async () => {
    await expect(works.upsert({ ...baseInput, name: "   " })).rejects.toThrow(
      /name/i,
    );
  });

  it("trims a name with surrounding whitespace", async () => {
    const created = await works.upsert({ ...baseInput, name: "  Test  " });
    expect(created.name).toBe("Test");
  });

  it("rejects a local blob: URL as the hero image", async () => {
    await expect(
      works.upsert({
        ...baseInput,
        image: { url: "blob:http://localhost/abc-123", alt: "" },
      }),
    ).rejects.toThrow(/blob:/);
  });

  it("rejects a local blob: URL in the gallery", async () => {
    await expect(
      works.upsert({
        ...baseInput,
        gallery: [{ url: "blob:http://localhost/xyz-456", alt: "" }],
      }),
    ).rejects.toThrow(/blob:/);
  });

  it("rejects a duplicate slug", async () => {
    await works.upsert(baseInput);
    await expect(works.upsert(baseInput)).rejects.toThrow(/slug/i);
  });

  it("fetches by slug", async () => {
    await works.upsert(baseInput);
    const found = await works.getBySlug("test-project");
    expect(found?.name).toBe("Test Project");
    expect(await works.getBySlug("missing")).toBeNull();
  });

  it("deletes a project", async () => {
    const created = await works.upsert(baseInput);
    await works.remove(created.id);
    expect(await works.getAll()).toHaveLength(0);
  });

  it("renumbers sortOrder contiguously on reorder, even with gaps", async () => {
    const a = await works.upsert({ ...baseInput, slug: "a" });
    const b = await works.upsert({ ...baseInput, slug: "b" });
    const c = await works.upsert({ ...baseInput, slug: "c" });
    await works.remove(b.id);

    await works.reorder([c.id, a.id]);

    const all = await works.getAll();
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
    await works.upsert({ ...baseInput, slug: "a-work" });
    await experiments.upsert({ ...baseInput, slug: "an-experiment" });

    expect((await works.getAll()).map((p) => p.slug)).toEqual(["a-work"]);
    expect((await experiments.getAll()).map((p) => p.slug)).toEqual([
      "an-experiment",
    ]);
    expect(await works.getBySlug("an-experiment")).toBeNull();
    expect(await experiments.getBySlug("a-work")).toBeNull();
  });

  it("allows the same slug in works and experiments", async () => {
    await works.upsert({ ...baseInput, slug: "same" });
    await expect(
      experiments.upsert({ ...baseInput, slug: "same" }),
    ).resolves.toBeDefined();
  });
});
