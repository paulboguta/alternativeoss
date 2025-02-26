import { db } from '@/db';
import {
  alternatives,
  categories,
  licenses,
  projectAlternatives,
  projectCategories,
  projectLicenses,
  projects,
} from '@/db/schema';
import { NewProject } from '@/db/types';
import { eq, or, sql } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache';
import { getAlternative } from './alternative';
import { getCategory } from './category';

export const checkIfProjectExists = async (slug: string) => {
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.slug, slug),
  });

  return !!project;
};

export const checkIfProjectExistsByUrls = async (websiteUrl?: string, repoUrl?: string) => {
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

  // Invalidate relevant cache tags
  revalidateTag('projects');
  revalidateTag(`projects-count`);

  return newProject;
};

export const getProject = async (slug: string) => {
  'use cache';
  cacheTag(`project/${slug}`);

  const project = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      url: projects.url,
      repoUrl: projects.repoUrl,
      summary: projects.summary,
      longDescription: projects.longDescription,
      features: projects.features,
    })
    .from(projects)
    .where(eq(projects.slug, slug));

  return project[0];
};

export const getProjectRepoStats = async (projectId: number) => {
  'use cache';
  cacheTag(`project-repo-stats/${projectId}`);

  const stats = await db
    .select({
      repoUrl: projects.repoUrl,
      repoStars: projects.repoStars,
      repoForks: projects.repoForks,
      repoLastCommit: projects.repoLastCommit,
      license: licenses,
    })
    .from(projects)
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(eq(projects.id, projectId));

  return stats[0];
};

export const getProjects = async () => {
  'use cache';
  cacheTag('projects');

  const results = await db
    .select({
      name: projects.name,
      slug: projects.slug,
      url: projects.url,
      repoStars: projects.repoStars,
      repoLastCommit: projects.repoLastCommit,
      license: licenses,
      summary: projects.summary,
    })
    .from(projects)
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id));

  return results;
};

export const getPaginatedProjects = async (page: number, limit: number) => {
  'use cache';
  cacheTag(`projects-page-${page}`);
  cacheTag(`projects-count`);

  const offset = (page - 1) * limit;

  const results = await db
    .select({
      name: projects.name,
      slug: projects.slug,
      url: projects.url,
      repoStars: projects.repoStars,
      repoLastCommit: projects.repoLastCommit,
      license: licenses,
      summary: projects.summary,
    })
    .from(projects)
    .innerJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .innerJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .limit(limit)
    .offset(offset);

  const countResult = await db.select({ count: sql<number>`count(*)` }).from(projects);

  const totalCount = countResult[0]?.count ? Number(countResult[0].count) : 0;

  return {
    projects: results,
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  };
};

export const getProjectsByCategory = async (slug: string) => {
  'use cache';
  cacheTag(`category/${slug}`);

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
    projects: result.map(result => ({
      ...result.projects,
      license: result.licenses,
    })),
    category,
  };
};

export const getProjectsByAlternative = async (slug: string) => {
  'use cache';
  cacheTag(`alternative/${slug}`);

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
    projects: result.map(result => ({
      ...result.projects,
      license: result.licenses,
    })),
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

  // Invalidate project-specific cache
  revalidateTag(`project/${slug}`);
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

  // Invalidate project-specific cache
  revalidateTag(`project/${slug}`);

  return project[0];
};

export const getProjectCategories = async (projectId: number) => {
  'use cache';
  cacheTag(`project-categories/${projectId}`);

  const result = await db
    .select()
    .from(categories)
    .innerJoin(projectCategories, eq(categories.id, projectCategories.categoryId))
    .where(eq(projectCategories.projectId, projectId));

  return result;
};

export const getProjectCategoriesWithCount = async (projectId: number) => {
  'use cache';
  cacheTag(`project-categories/${projectId}`);

  const result = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      count: sql<number>`(
        SELECT COUNT(*)
        FROM ${projectCategories}
        WHERE ${projectCategories.categoryId} = ${categories.id}
      )`.as('count'),
    })
    .from(categories)
    .innerJoin(projectCategories, eq(categories.id, projectCategories.categoryId))
    .where(eq(projectCategories.projectId, projectId))
    .orderBy(sql`count DESC`);

  return result.map(({ categoryId, categoryName, count }) => ({
    categoryId,
    categoryName,
    count: Number(count),
  }));
};

export const getOtherCategoriesWithCount = async (projectId: number, limit = 5) => {
  'use cache';
  cacheTag(`other-categories/${projectId}`);
  cacheTag('categories'); // General categories cache tag

  const result = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      count: sql<number>`(
        SELECT COUNT(*)
        FROM ${projectCategories}
        WHERE ${projectCategories.categoryId} = ${categories.id}
      )`.as('count'),
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
  'use cache';
  cacheTag(`project-alternatives/${projectId}`);

  const result = await db
    .select()
    .from(alternatives)
    .innerJoin(projectAlternatives, eq(alternatives.id, projectAlternatives.alternativeId))
    .where(eq(projectAlternatives.projectId, projectId));

  return result;
};

// Function to add a project to a category
export const addProjectToCategory = async (projectId: number, categoryId: number) => {
  await db.insert(projectCategories).values({ projectId, categoryId });

  // Invalidate relevant cache tags
  revalidateTag(`project-categories/${projectId}`);
  revalidateTag(`other-categories/${projectId}`);
  revalidateTag('categories');
};

// Function to add an alternative to a project
export const addAlternativeToProject = async (projectId: number, alternativeId: number) => {
  await db.insert(projectAlternatives).values({ projectId, alternativeId });

  // Invalidate relevant cache tags
  revalidateTag(`project-alternatives/${projectId}`);
  revalidateTag(`alternative/${alternativeId}`);
};
