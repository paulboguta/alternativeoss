import { db } from "@/db";
import {
  alternatives,
  categories,
  licenses,
  projectAlternatives,
  projectCategories,
  projectLicenses,
  projects,
} from "@/db/schema";
import { NewProject } from "@/db/types";
import { eq, or, sql } from "drizzle-orm";
import { getAlternative } from "./alternative";
import { getCategory } from "./category";

export const checkIfProjectExists = async (slug: string) => {
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.slug, slug),
  });

  return !!project;
};

export const checkIfProjectExistsByUrls = async (
  websiteUrl?: string,
  repoUrl?: string
) => {
  if (!websiteUrl && !repoUrl) return false;

  const existingProject = await db
    .select()
    .from(projects)
    .where(
      or(
        websiteUrl ? eq(projects.url, websiteUrl) : undefined,
        repoUrl ? eq(projects.repoUrl, repoUrl) : undefined
      )
    )
    .limit(1);

  return existingProject.length > 0;
};

export const createProject = async (project: NewProject) => {
  const [newProject] = await db.insert(projects).values(project).returning();

  return newProject;
};

export const getProject = async (slug: string) => {
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.slug, slug),
  });

  return project;
};

export const getProjects = async () => {
  const results = await db
    .select()
    .from(projects)
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id));

  return results.map((result) => ({
    ...result.projects,
    license: result.licenses,
  }));
};

export const getProjectsByCategory = async (slug: string) => {
  const category = await getCategory(slug);
  
  if (!category) {
    return { projects: [], category: null };
  }

  const result = await db
    .select()
    .from(projects)
    .innerJoin(projectCategories, eq(projects.id, projectCategories.projectId))
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(eq(projectCategories.categoryId, category.id));

  return {
    projects: result.map((result) => ({
      ...result.projects,
      license: result.licenses,
    })),
    category,
  };
};

export const getProjectsByAlternative = async (slug: string) => {
  const alternative = await getAlternative(slug);

  if (!alternative) {
    return { projects: [], alternative: null };
  }

  const result = await db
    .select()
    .from(projects)
    .innerJoin(projectAlternatives, eq(projects.id, projectAlternatives.projectId))
    .innerJoin(alternatives, eq(projectAlternatives.alternativeId, alternatives.id))
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(eq(projectAlternatives.alternativeId, alternative.id));

  return {
    projects: result.map((result) => ({
      ...result.projects,
      license: result.licenses,
    })),
    alternative,
  };
};

export const updateProjectRepoStats = async (
  slug: string,
  stats: {
    stars: number;
    forks: number;
    createdAt: string;
    lastCommit: string;
  }
) => {
  await db
    .update(projects)
    .set({
      repoStars: stats.stars,
      repoForks: stats.forks,
      repoCreatedAt: new Date(stats.createdAt),
      repoLastCommit: new Date(stats.lastCommit),
      updatedAt: new Date(),
    })
    .where(eq(projects.slug, slug));
};

export const updateProjectContent = async (
  slug: string,
  content: {
    summary: string;
    longDescription: string;
    features: string[];
  }
) => {
  const project = await db
    .update(projects)
    .set({
      summary: content.summary,
      longDescription: content.longDescription,
      features: content.features,
    })
    .where(eq(projects.slug, slug))
    .returning();

  return project[0];
};

export const getProjectCategories = async (projectId: number) => {
  const result = await db
    .select()
    .from(categories)
    .innerJoin(
      projectCategories,
      eq(categories.id, projectCategories.categoryId)
    )
    .where(eq(projectCategories.projectId, projectId));

  return result;
};

export const getProjectCategoriesWithCount = async (projectId: number) => {
  const result = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      count: sql<number>`(
        SELECT COUNT(*)
        FROM ${projectCategories}
        WHERE ${projectCategories.categoryId} = ${categories.id}
      )`.as("count"),
    })
    .from(categories)
    .innerJoin(
      projectCategories,
      eq(categories.id, projectCategories.categoryId)
    )
    .where(eq(projectCategories.projectId, projectId))
    .orderBy(sql`count DESC`);

  return result.map(({ categoryId, categoryName, count }) => ({
    categoryId,
    categoryName,
    count: Number(count),
  }));
};

export const getOtherCategoriesWithCount = async (
  projectId: number,
  limit = 5
) => {
  const result = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      count: sql<number>`(
        SELECT COUNT(*)
        FROM ${projectCategories}
        WHERE ${projectCategories.categoryId} = ${categories.id}
      )`.as("count"),
    })
    .from(categories)
    .where(
      sql`${categories.id} NOT IN (
        SELECT ${projectCategories.categoryId}
        FROM ${projectCategories}
        WHERE ${projectCategories.projectId} = ${projectId}
      )`
    )
    .orderBy(sql`count DESC`)
    .limit(limit);

  return result.map(({ categoryId, categoryName, count }) => ({
    categoryId,
    categoryName,
    count: Number(count),
  }));
};

export const getProjectAlternatives = async (projectId: number) => {
  const result = await db
    .select()
    .from(alternatives)
    .innerJoin(
      projectAlternatives,
      eq(alternatives.id, projectAlternatives.alternativeId)
    )
    .where(eq(projectAlternatives.projectId, projectId));

  return result;
};
