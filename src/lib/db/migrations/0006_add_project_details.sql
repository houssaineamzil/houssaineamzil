ALTER TABLE "experiments" ADD COLUMN "project_type" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "roles" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "designer" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "developer" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_type" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "roles" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "designer" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "developer" text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE "projects" SET "roles" = CASE "role"
  WHEN 'Art Direction, Design & Development' THEN '["Art Director","Designer","Developer"]'::jsonb
  WHEN 'Art Direction & Web Design' THEN '["Art Director","Designer"]'::jsonb
  WHEN 'Web Design & Development' THEN '["Designer","Developer"]'::jsonb
  WHEN 'Design & Development' THEN '["Designer","Developer"]'::jsonb
  WHEN 'Brand Identity' THEN '["Brand Designer"]'::jsonb
  WHEN 'Art Direction' THEN '["Art Director"]'::jsonb
  WHEN 'Front-end Development' THEN '["Developer"]'::jsonb
  WHEN 'Web Design' THEN '["Designer"]'::jsonb
  WHEN 'Motion Design' THEN '["Designer"]'::jsonb
  ELSE '[]'::jsonb
END;--> statement-breakpoint
UPDATE "experiments" SET "roles" = CASE "role"
  WHEN 'Art Direction, Design & Development' THEN '["Art Director","Designer","Developer"]'::jsonb
  WHEN 'Art Direction & Web Design' THEN '["Art Director","Designer"]'::jsonb
  WHEN 'Web Design & Development' THEN '["Designer","Developer"]'::jsonb
  WHEN 'Design & Development' THEN '["Designer","Developer"]'::jsonb
  WHEN 'Brand Identity' THEN '["Brand Designer"]'::jsonb
  WHEN 'Art Direction' THEN '["Art Director"]'::jsonb
  WHEN 'Front-end Development' THEN '["Developer"]'::jsonb
  WHEN 'Web Design' THEN '["Designer"]'::jsonb
  WHEN 'Motion Design' THEN '["Designer"]'::jsonb
  ELSE '[]'::jsonb
END;