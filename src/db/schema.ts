import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  summary: text("summary"),
  longDescription: text("long_description"),
  features: text("features").array(),

  url: text("url"),
  logoUrl: text("logo_url"),

  repoUrl: text("repo_url"),
  repoStars: integer("repo_stars"),
  repoForks: integer("repo_forks"),
  repoLastCommit: timestamp("repo_last_commit", { mode: "date" }),
  repoCreatedAt: timestamp("repo_created_at", { mode: "date" }),

  affiliateCode: text("affiliate_code"),
  isClaimed: boolean("is_claimed").default(false),
  isFeatured: boolean("is_featured").default(false),
  isLive: boolean("is_live").default(false),
  isScheduled: boolean("is_scheduled").default(false),
  featureEndAt: timestamp("feature_end_at", { mode: "date" }),
  scheduledAt: timestamp("scheduled_at", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Projects relations
export const projectsRelations = relations(projects, ({ many }) => ({
  projectCategories: many(projectCategories),
  projectLicenses: many(projectLicenses),
  // ** in 2.0:
  //   projectAlternatives: many(projectAlternatives, {
  //     relationName: "projectAlternatives",
  //   }),
  //   alternativeToProjects: many(projectAlternatives, {
  //     relationName: "alternativeToProjects",
  //   }),
  //   projectExternalAlternatives: many(projectExternalAlternatives),
}));

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  projectName: text("project_name").notNull(),
  email: text("email").notNull(),
  websiteUrl: text("website_url"),
  repoLink: text("repo_link").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  projectCategories: many(projectCategories),
}));

export const projectCategories = pgTable(
  "project_categories",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.projectId, table.categoryId),
  })
);

export const projectCategoriesRelations = relations(
  projectCategories,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectCategories.projectId],
      references: [projects.id],
    }),
    category: one(categories, {
      fields: [projectCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  key: text("key").unique().notNull(),
});

export const licensesRelations = relations(licenses, ({ many }) => ({
  projects: many(projects),
}));

export const projectLicenses = pgTable("project_licenses", {
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  licenseId: integer("license_id")
    .notNull()
    .references(() => licenses.id, { onDelete: "cascade" }),
});

export const projectLicensesRelations = relations(
  projectLicenses,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectLicenses.projectId],
      references: [projects.id],
    }),
    license: one(licenses, {
      fields: [projectLicenses.licenseId],
      references: [licenses.id],
    }),
  })
);

// ** --- in 2.0:

// export const projectAlternatives = pgTable(
//   "project_alternatives",
//   {
//     projectId: integer("project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//     alternativeProjectId: integer("alternative_project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//   },
//   (table) => ({
//     pk: primaryKey(table.projectId, table.alternativeProjectId),
//   })
// );

// export const projectAlternativesRelations = relations(
//   projectAlternatives,
//   ({ one }) => ({
//     project: one(projects, {
//       fields: [projectAlternatives.projectId],
//       references: [projects.id],
//       relationName: "projectAlternatives",
//     }),
//     alternativeProject: one(projects, {
//       fields: [projectAlternatives.alternativeProjectId],
//       references: [projects.id],
//       relationName: "alternativeToProjects",
//     }),
//   })
// );

// export const externalAlternatives = pgTable("external_alternatives", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   url: text("url").notNull(),
//   description: text("description"),
//   logoUrl: text("logo_url"),
// });

// export const externalAlternativesRelations = relations(
//   externalAlternatives,
//   ({ many }) => ({
//     projectExternalAlternatives: many(projectExternalAlternatives),
//   })
// );

// export const projectExternalAlternatives = pgTable(
//   "project_external_alternatives",
//   {
//     projectId: integer("project_id")
//       .notNull()
//       .references(() => projects.id, { onDelete: "cascade" }),
//     externalAlternativeId: integer("external_alternative_id")
//       .notNull()
//       .references(() => externalAlternatives.id, { onDelete: "cascade" }),
//   },
//   (table) => ({
//     pk: primaryKey(table.projectId, table.externalAlternativeId),
//   })
// );

// export const projectExternalAlternativesRelations = relations(
//   projectExternalAlternatives,
//   ({ one }) => ({
//     project: one(projects, {
//       fields: [projectExternalAlternatives.projectId],
//       references: [projects.id],
//     }),
//     externalAlternative: one(externalAlternatives, {
//       fields: [projectExternalAlternatives.externalAlternativeId],
//       references: [externalAlternatives.id],
//     }),
//   })
// );
