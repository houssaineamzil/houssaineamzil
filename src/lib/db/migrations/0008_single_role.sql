ALTER TABLE "experiments" ADD COLUMN "role" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "role" text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE "projects" SET "role" = CASE
  WHEN "roles" ? 'Art Director' THEN 'Art Director'
  WHEN "roles" ? 'Brand Designer' THEN 'Brand Designer'
  WHEN "roles" ? 'Designer' THEN 'Designer'
  WHEN "roles" ? 'Developer' THEN 'Developer'
  ELSE ''
END;--> statement-breakpoint
UPDATE "experiments" SET "role" = CASE
  WHEN "roles" ? 'Art Director' THEN 'Art Director'
  WHEN "roles" ? 'Brand Designer' THEN 'Brand Designer'
  WHEN "roles" ? 'Designer' THEN 'Designer'
  WHEN "roles" ? 'Developer' THEN 'Developer'
  ELSE ''
END;