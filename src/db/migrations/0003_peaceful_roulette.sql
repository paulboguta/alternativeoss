CREATE TABLE "alternatives" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text,
	"description" text,
	"url" text,
	"logo_url" text,
	"price" integer,
	"pricing_model" text,
	"is_paid" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "alternatives_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_alternatives" (
	"project_id" integer NOT NULL,
	"alternative_id" integer NOT NULL,
	CONSTRAINT "project_alternatives_project_id_alternative_id_pk" PRIMARY KEY("project_id","alternative_id")
);
--> statement-breakpoint
ALTER TABLE "project_alternatives" ADD CONSTRAINT "project_alternatives_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_alternatives" ADD CONSTRAINT "project_alternatives_alternative_id_alternatives_id_fk" FOREIGN KEY ("alternative_id") REFERENCES "public"."alternatives"("id") ON DELETE cascade ON UPDATE no action;