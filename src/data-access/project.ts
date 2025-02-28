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
import { eq, ilike, or, sql, SQL } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { getAlternative } from './alternative';
import { getCategory } from './category';

export const findProject = async (condition: SQL<unknown>): Promise<boolean | null> => {
  const result = await db.select().from(projects).where(condition).limit(1);

  return result.length > 0;
};

export const getAllProjects = async () => {
  const result = await db.select({ slug: projects.slug }).from(projects);

  return result;
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
      faviconUrl: projects.faviconUrl,
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

export const getProjects = async ({
  searchQuery = '',
  page = 1,
  limit = 10,
  sortField = 'createdAt',
  sortDirection = 'desc',
  // TODO: Apply filters when implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filters = {},
}: {
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  filters?: Record<string, unknown>;
} = {}) => {
  const offset = (page - 1) * limit;

  // Build the ORDER BY clause
  const orderByClause = (() => {
    if (sortField === 'name') {
      return sortDirection === 'asc' ? sql`projects.name ASC` : sql`projects.name DESC`;
    }

    if (sortField === 'repoStars') {
      return sortDirection === 'asc' ? sql`projects.repo_stars ASC` : sql`projects.repo_stars DESC`;
    }

    if (sortField === 'repoLastCommit') {
      return sortDirection === 'asc'
        ? sql`projects.repo_last_commit ASC`
        : sql`projects.repo_last_commit DESC`;
    }

    return sortDirection === 'asc' ? sql`projects.created_at ASC` : sql`projects.created_at DESC`;
  })();

  // Build the WHERE condition
  let condition = sql`TRUE`;

  // Apply search if query exists
  if (searchQuery && searchQuery.trim()) {
    // For full-text search using the search_vector column
    const searchCondition = sql`projects.search_vector @@ plainto_tsquery('english', ${searchQuery})`;

    // Fallback to ILIKE search for partial matches
    const fallbackCondition = or(
      ilike(projects.name, `%${searchQuery}%`),
      ilike(projects.summary, `%${searchQuery}%`),
      ilike(projects.longDescription, `%${searchQuery}%`)
    );

    // Combine both conditions with OR
    condition = or(searchCondition, fallbackCondition)!;
  }

  // TODO: Apply filters when implemented
  // if (filters.someFilter) { ... }

  // Select fields
  const selectFields = {
    id: projects.id,
    name: projects.name,
    slug: projects.slug,
    url: projects.url,
    repoStars: projects.repoStars,
    repoLastCommit: projects.repoLastCommit,
    license: licenses,
    summary: projects.summary,
    faviconUrl: projects.faviconUrl,
  };

  // Add rank field for search queries
  if (searchQuery && searchQuery.trim()) {
    Object.assign(selectFields, {
      rank: sql<number>`ts_rank(projects.search_vector, plainto_tsquery('english', ${searchQuery}))`,
    });
  }

  // Get the projects
  const query = db
    .select(selectFields)
    .from(projects)
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(condition)
    .limit(limit)
    .offset(offset);

  // Apply ordering
  if (orderByClause) {
    query.orderBy(orderByClause);
  }

  const resultsPromise = query;

  const totalCountPromise = db.$count(projects, condition);

  const [results, totalCount] = await Promise.all([resultsPromise, totalCountPromise]);

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
    .select({
      id: alternatives.id,
      name: alternatives.name,
      slug: alternatives.slug,
      faviconUrl: alternatives.faviconUrl,
    })
    .from(alternatives)
    .innerJoin(projectAlternatives, eq(alternatives.id, projectAlternatives.alternativeId))
    .where(eq(projectAlternatives.projectId, projectId));

  return result;
};

export const addProjectToCategory = async (projectId: number, categoryId: number) => {
  await db.insert(projectCategories).values({ projectId, categoryId });
};

export const addAlternativeToProject = async (projectId: number, alternativeId: number) => {
  await db.insert(projectAlternatives).values({ projectId, alternativeId });
};
