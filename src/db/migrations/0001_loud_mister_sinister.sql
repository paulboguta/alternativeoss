CREATE TABLE "licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	CONSTRAINT "licenses_name_unique" UNIQUE("name"),
	CONSTRAINT "licenses_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "project_licenses" (
	"project_id" integer NOT NULL,
	"license_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_licenses" ADD CONSTRAINT "project_licenses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_licenses" ADD CONSTRAINT "project_licenses_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "license";--> statement-breakpoint
DROP TYPE "public"."license_enum";