import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import type { AboutContent, SiteLinks } from "@/lib/db/schema";
import { siteSettings } from "@/lib/db/schema";

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

export async function getAboutContent(): Promise<AboutContent> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, ABOUT_ID))
    .limit(1);
  return row ? (row.content as AboutContent) : DEFAULT_ABOUT;
}

export async function updateAboutContent(content: AboutContent): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ id: ABOUT_ID, content, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { content, updatedAt: new Date() },
    });
}

export async function getSiteLinks(): Promise<SiteLinks> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, LINKS_ID))
    .limit(1);
  return row ? (row.content as SiteLinks) : DEFAULT_LINKS;
}

export async function updateSiteLinks(links: SiteLinks): Promise<void> {
  await db
    .insert(siteSettings)
    .values({ id: LINKS_ID, content: links, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { content: links, updatedAt: new Date() },
    });
}
