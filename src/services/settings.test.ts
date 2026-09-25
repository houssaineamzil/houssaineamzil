import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import {
  getAboutContent,
  getSiteLinks,
  updateAboutContent,
  updateSiteLinks,
} from "./settings";

beforeEach(async () => {
  await db.delete(siteSettings);
});

afterAll(async () => {
  await db.delete(siteSettings);
});

describe("settings service", () => {
  it("returns default about content when unset", async () => {
    const about = await getAboutContent();
    expect(about.paragraphs.length).toBeGreaterThan(0);
  });

  it("round-trips updated about content", async () => {
    await updateAboutContent({
      paragraphs: ["One.", "Two."],
      portrait: { url: "/portrait.avif", alt: "" },
    });
    const about = await getAboutContent();
    expect(about.paragraphs).toEqual(["One.", "Two."]);
  });

  it("returns default links when unset", async () => {
    const links = await getSiteLinks();
    expect(links.email).toContain("@");
  });

  it("round-trips updated links", async () => {
    await updateSiteLinks({
      linkedin: "https://linkedin.com/in/x",
      instagram: "https://instagram.com/x",
      behance: "https://behance.net/x",
      email: "x@example.com",
    });
    const links = await getSiteLinks();
    expect(links.email).toBe("x@example.com");
  });
});
