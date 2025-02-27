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
import { eq, sql, SQL } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { getAlternative } from './alternative';
import { getCategory } from './category';

type ProjectSelectFields<TExtra extends string = never> = Partial<
  (typeof projects)['_']['columns']
> &
  Record<TExtra, SQL<unknown>>;

export const findProjects = async <T extends ProjectSelectFields>(
  select: T,
  condition: SQL<unknown>,
  orderBy?: SQL<unknown>,
  limit?: number,
  offset?: number
) => {
  const query = db.select(select).from(projects).where(condition);

  if (orderBy) {
    query.orderBy(orderBy);
  }

  if (limit !== undefined) {
    query.limit(limit);
  }

  if (offset !== undefined) {
    query.offset(offset);
  }

  const result = await query.execute();

  return result;
};

export const findProject = async (condition: SQL<unknown>): Promise<boolean | null> => {
  const result = await db.select().from(projects).where(condition).limit(1);

  return result.length > 0;
};

export const createProject = async (project: NewProject) => {
  const [newProject] = await db.insert(projects).values(project).returning();
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
      repoStars: projects.repoStars,
      repoForks: projects.repoForks,
      repoLastCommit: projects.repoLastCommit,
      summary: projects.summary,
      longDescription: projects.longDescription,
      features: projects.features,
      license: licenses,
    })
    .from(projects)
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
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
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
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
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id));

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
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
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
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
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
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(eq(projectAlternatives.alternativeId, alternative.id));

  return {
    projects: result.map(result => ({
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
  const updatedProjects = await db
    .update(projects)
    .set({
      repoStars: stats.stars,
      repoForks: stats.forks,
      repoCreatedAt: new Date(stats.createdAt),
      repoLastCommit: new Date(stats.lastCommit),
      updatedAt: new Date(),
    })
    .where(eq(projects.slug, slug))
    .returning();

  return updatedProjects[0];
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
};

// Function to add an alternative to a project
export const addAlternativeToProject = async (projectId: number, alternativeId: number) => {
  await db.insert(projectAlternatives).values({ projectId, alternativeId });
};
