import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  summary: text('summary'),
  longDescription: text('long_description'),
  features: text('features').array(),

  url: text('url'),
  logoUrl: text('logo_url'),

  repoUrl: text('repo_url'),
  repoStars: integer('repo_stars'),
  repoForks: integer('repo_forks'),
  repoLastCommit: timestamp('repo_last_commit', { mode: 'date' }),
  repoCreatedAt: timestamp('repo_created_at', { mode: 'date' }),

  affiliateCode: text('affiliate_code'),
  isClaimed: boolean('is_claimed').default(false),
  isFeatured: boolean('is_featured').default(false),
  isLive: boolean('is_live').default(false),
  isScheduled: boolean('is_scheduled').default(false),
  featureEndAt: timestamp('feature_end_at', { mode: 'date' }),
  scheduledAt: timestamp('scheduled_at', { mode: 'date' }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  projectCategories: many(projectCategories),
  projectLicenses: many(projectLicenses),
  alternatives: many(projectAlternatives),
}));

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  projectName: text('project_name').notNull(),
  email: text('email').notNull(),
  websiteUrl: text('website_url'),
  repoLink: text('repo_link').notNull(),
  description: text('description'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  projectCategories: many(projectCategories),
}));

export const projectCategories = pgTable(
  'project_categories',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  table => ({
    pk: primaryKey(table.projectId, table.categoryId),
  })
);

export const projectCategoriesRelations = relations(projectCategories, ({ one }) => ({
  project: one(projects, {
    fields: [projectCategories.projectId],
    references: [projects.id],
  }),
  category: one(categories, {
    fields: [projectCategories.categoryId],
    references: [categories.id],
  }),
}));

export const licenses = pgTable('licenses', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  key: text('key').unique().notNull(),
});

export const licensesRelations = relations(licenses, ({ many }) => ({
  projects: many(projects),
}));

export const projectLicenses = pgTable('project_licenses', {
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  licenseId: integer('license_id')
    .notNull()
    .references(() => licenses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const projectLicensesRelations = relations(projectLicenses, ({ one }) => ({
  project: one(projects, {
    fields: [projectLicenses.projectId],
    references: [projects.id],
  }),
  license: one(licenses, {
    fields: [projectLicenses.licenseId],
    references: [licenses.id],
  }),
}));

export const alternatives = pgTable('alternatives', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary'),
  description: text('description'),
  url: text('url'),
  logoUrl: text('logo_url'),
  price: integer('price'),
  pricingModel: text('pricing_model'),
  isPaid: boolean('is_paid').default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

export const projectAlternatives = pgTable(
  'project_alternatives',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    alternativeId: integer('alternative_id')
      .notNull()
      .references(() => alternatives.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  table => ({
    pk: primaryKey(table.projectId, table.alternativeId),
  })
);

export const alternativesRelations = relations(alternatives, ({ many }) => ({
  projects: many(projectAlternatives),
}));

export const emails = pgTable('emails', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});
