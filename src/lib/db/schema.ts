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

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull().default(""),
  description: text("description").notNull().default(""),
  labels: jsonb("labels").$type<string[]>().notNull().default([]),
  year: text("year").notNull().default(""),
  role: text("role").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  gallery: jsonb("gallery").$type<MediaType[]>().notNull().default([]),
  horizontal: boolean("horizontal").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

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
