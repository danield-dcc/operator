CREATE TYPE "public"."issue_severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('excellent', 'good', 'needs_improvement', 'needs_serious_help', 'disaster');--> statement-breakpoint
CREATE TABLE "roast_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"share_id" text NOT NULL,
	"code" text NOT NULL,
	"language" text NOT NULL,
	"line_count" integer NOT NULL,
	"roast_mode" boolean DEFAULT true NOT NULL,
	"score" real NOT NULL,
	"verdict" "verdict" NOT NULL,
	"roast_quote" text NOT NULL,
	"suggested_code" text,
	"ai_model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roasts_shareId_unique" UNIQUE("share_id")
);
--> statement-breakpoint
ALTER TABLE "roast_issues" ADD CONSTRAINT "roast_issues_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "roast_issues_roast_id_idx" ON "roast_issues" USING btree ("roast_id");