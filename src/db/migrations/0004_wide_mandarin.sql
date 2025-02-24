ALTER TABLE "project_alternatives" DROP CONSTRAINT "project_alternatives_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_alternatives" DROP CONSTRAINT "project_alternatives_alternative_id_alternatives_id_fk";
--> statement-breakpoint
ALTER TABLE "project_categories" DROP CONSTRAINT "project_categories_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_categories" DROP CONSTRAINT "project_categories_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "project_licenses" DROP CONSTRAINT "project_licenses_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "project_licenses" DROP CONSTRAINT "project_licenses_license_id_licenses_id_fk";
--> statement-breakpoint
ALTER TABLE "project_alternatives" ADD CONSTRAINT "project_alternatives_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_alternatives" ADD CONSTRAINT "project_alternatives_alternative_id_alternatives_id_fk" FOREIGN KEY ("alternative_id") REFERENCES "public"."alternatives"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_licenses" ADD CONSTRAINT "project_licenses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "project_licenses" ADD CONSTRAINT "project_licenses_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE cascade ON UPDATE cascade;