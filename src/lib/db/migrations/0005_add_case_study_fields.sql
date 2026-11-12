ALTER TABLE "experiments" ADD COLUMN "strategy" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "result" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "impact" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "strategy" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "result" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "impact" text DEFAULT '' NOT NULL;