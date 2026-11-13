import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/lib/db/client";
import type { AboutContent, SiteLinks } from "@/lib/db/schema";
import { siteSettings } from "@/lib/db/schema";
import { assertPersistableUrl } from "@/lib/utils";

const ABOUT_ID = "about";
const LINKS_ID = "links";

const DEFAULT_ABOUT: AboutContent = {
  paragraphs: [
    "Høussaine Amzil is a creative developer.",
    "He designs and builds interactive, motion-driven interfaces at the crossroads of design and engineering. Guided by rhythm, detail and feel, his work explores the tension between code and craft.",
    "Influenced by editorial design and motion graphics, he shapes minimal yet expressive experiences — where every interaction is intentional, every detail considered.",
    "Høussaine collaborates with brands and studios who value thoughtful, well-crafted digital products.",
  ],
  portrait: { url: "/aqgfyrlygqymxaue7cz4.avif", alt: "Høussaine Amzil" },
};

const DEFAULT_LINKS: SiteLinks = {
  linkedin: "https://linkedin.com/in/houssaineamzil",
  instagram: "https://instagram.com/houssaineamzil18",
  behance: "https://behance.net/houssaineamzil",
  email: "houssaineamzil18@gmail.com",
};

// `content` is one jsonb column shared by every setting, so each id is tied
// to its shape here and callers never cast.
async function readSetting<T extends AboutContent | SiteLinks>(
  id: string,
  fallback: T,
): Promise<T> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, id))
    .limit(1);
  return row ? (row.content as T) : fallback;
}

async function writeSetting(
  id: string,
  content: AboutContent | SiteLinks,
): Promise<void> {
  const updatedAt = new Date();
  await db
    .insert(siteSettings)
    .values({ id, content, updatedAt })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { content, updatedAt },
    });
}

export const getAboutContent = cache(() =>
  readSetting(ABOUT_ID, DEFAULT_ABOUT),
);

export async function updateAboutContent(content: AboutContent): Promise<void> {
  assertPersistableUrl(content.portrait.url, "portrait image");
  await writeSetting(ABOUT_ID, content);
}

// Read by the nav on every page and again by project pages: once per request.
export const getSiteLinks = cache(() => readSetting(LINKS_ID, DEFAULT_LINKS));

export const updateSiteLinks = (links: SiteLinks) =>
  writeSetting(LINKS_ID, links);
