import { db } from "@/db";
import {
  licenses,
  projectCategories,
  projectLicenses,
  projects,
} from "@/db/schema";
import { NewProject } from "@/db/types";
import { eq } from "drizzle-orm";
import { getCategory } from "./category";

export const checkIfProjectExists = async (slug: string) => {
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.slug, slug),
  });

  return !!project;
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

export const getProjectsByCategory = async (
  slug: string
) => {
  const category = await getCategory(slug);

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
