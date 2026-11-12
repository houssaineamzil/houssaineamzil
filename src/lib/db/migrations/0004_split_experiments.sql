CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"labels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"image_alt" text DEFAULT '' NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"horizontal" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "experiments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
INSERT INTO "experiments" ("id", "slug", "name", "description", "labels", "year", "role", "image_url", "image_alt", "gallery", "horizontal", "sort_order", "updated_at")
SELECT "id", "slug", "name", "description", "labels", "year", "role", "image_url", "image_alt", "gallery", "horizontal",
	(ROW_NUMBER() OVER (ORDER BY "sort_order") - 1)::integer,
	"updated_at"
FROM "projects"
WHERE "category" = 'experiment';
--> statement-breakpoint
DELETE FROM "projects" WHERE "category" = 'experiment';
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "category";