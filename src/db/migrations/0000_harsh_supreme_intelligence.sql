CREATE TYPE "public"."license_enum" AS ENUM('AGPL-3.0', 'MIT', 'Apache-2.0', 'GPL-3.0', 'MPL-2.0', 'BSD-3-Clause', 'GPL-2.0', 'LGPL-2.1', 'BSD-2-Clause', 'EPL-2.0', 'LGPL-3.0');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "project_categories" (
	"project_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "project_categories_project_id_category_id_pk" PRIMARY KEY("project_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"long_description" text,
	"features" text[],
	"url" text,
	"logo_url" text,
	"license" "license_enum",
	"repo_url" text,
	"repo_stars" integer,
	"repo_forks" integer,
	"repo_last_commit" timestamp,
	"repo_created_at" timestamp,
	"affiliate_code" text,
	"is_claimed" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_live" boolean DEFAULT false,
	"is_scheduled" boolean DEFAULT false,
	"feature_end_at" timestamp,
	"scheduled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"project_name" text NOT NULL,
	"email" text NOT NULL,
	"website_url" text,
	"repo_link" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;