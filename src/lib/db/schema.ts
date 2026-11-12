import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { MediaType } from "@/types";

// Works and experiments are deliberately two separate tables with the same
// shape: each has its own list, admin section and public pages, and the two
// can grow different fields later without touching each other.
const projectColumns = () => ({
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  // Optional case-study sections shown under the description on work pages:
  // how the work was approached, what was made, what changed for the client.
  strategy: text("strategy").notNull().default(""),
  result: text("result").notNull().default(""),
  impact: text("impact").notNull().default(""),
  year: text("year").notNull().default(""),
  projectType: text("project_type").notNull().default(""),
  url: text("url").notNull().default(""),
  role: text("role").notNull().default(""),
  // Optional: set when someone else designed / built part of the project.
  designer: text("designer").notNull().default(""),
  developer: text("developer").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  gallery: jsonb("gallery").$type<MediaType[]>().notNull().default([]),
  horizontal: boolean("horizontal").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", projectColumns());
export const experiments = pgTable("experiments", projectColumns());

export interface AboutContent {
  paragraphs: string[];
  portrait: MediaType;
}

export interface SiteLinks {
  linkedin: string;
  instagram: string;
  behance: string;
  email: string;
}

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  content: jsonb("content").notNull().$type<AboutContent | SiteLinks>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
