import { db } from '@/db';
import {
  alternatives,
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
}) => {
  // Calculate offset for pagination
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

  // Optimize query execution by running count and data fetch in parallel
  const resultsPromise = db
    .select(selectFields)
    .from(projects)
    .leftJoin(projectLicenses, eq(projects.id, projectLicenses.projectId))
    .leftJoin(licenses, eq(projectLicenses.licenseId, licenses.id))
    .where(condition)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  const totalCountPromise = db.$count(projects, condition);

  // Execute both queries in parallel for better performance
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

export const addProjectToCategory = async (projectId: number, categoryId: number) => {
  await db.insert(projectCategories).values({ projectId, categoryId });
};

export const addAlternativeToProject = async (projectId: number, alternativeId: number) => {
  await db.insert(projectAlternatives).values({ projectId, alternativeId });
};

export const getProjectSidebarData = async (projectId: number, otherCategoriesLimit = 5) => {
  // TODO: Cursor output - verify if you can do it with drizzle orm
  const query = sql`
    WITH project_categories_with_count AS (
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(pc2.project_id) AS count
      FROM categories c
      INNER JOIN project_categories pc ON c.id = pc.category_id
      INNER JOIN project_categories pc2 ON c.id = pc2.category_id
      WHERE pc.project_id = ${projectId}
      GROUP BY c.id, c.name
      ORDER BY count DESC
    ),
    other_categories_with_count AS (
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(pc.project_id) AS count
      FROM categories c
      LEFT JOIN project_categories pc ON c.id = pc.category_id
      WHERE c.id NOT IN (
        SELECT category_id 
        FROM project_categories 
        WHERE project_id = ${projectId}
      )
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT ${otherCategoriesLimit}
    ),
    project_alternatives_data AS (
      SELECT 
        a.id,
        a.name,
        a.slug,
        a.favicon_url
      FROM alternatives a
      INNER JOIN project_alternatives pa ON a.id = pa.alternative_id
      WHERE pa.project_id = ${projectId}
    )
    SELECT 
      'project_categories' AS data_type,
      jsonb_build_object(
        'categoryId', pc.category_id,
        'categoryName', pc.category_name,
        'count', pc.count
      ) AS data
    FROM project_categories_with_count pc
    UNION ALL
    SELECT 
      'other_categories' AS data_type,
      jsonb_build_object(
        'categoryId', oc.category_id,
        'categoryName', oc.category_name,
        'count', oc.count
      ) AS data
    FROM other_categories_with_count oc
    UNION ALL
    SELECT 
      'project_alternatives' AS data_type,
      jsonb_build_object(
        'id', pa.id,
        'name', pa.name,
        'slug', pa.slug,
        'faviconUrl', pa.favicon_url
      ) AS data
    FROM project_alternatives_data pa
  `;

  type CategoryData = {
    categoryId: number;
    categoryName: string;
    count: number | string;
  };

  type AlternativeData = {
    id: number;
    name: string;
    slug: string;
    faviconUrl: string | null;
  };

  type QueryResult = {
    data_type: string;
    data: CategoryData | AlternativeData;
  };

  const result = await db.execute<QueryResult>(query);

  // Process the results
  const projectCategories: Array<{
    categoryId: number;
    categoryName: string;
    count: number;
  }> = [];

  const otherCategories: Array<{
    categoryId: number;
    categoryName: string;
    count: number;
  }> = [];

  const projectAlternatives: Array<{
    id: number;
    name: string;
    slug: string;
    faviconUrl: string | null;
  }> = [];

  // Parse the results
  for (const row of result.rows) {
    const dataType = row.data_type;

    if (dataType === 'project_categories') {
      const data = row.data as CategoryData;
      projectCategories.push({
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        count: Number(data.count),
      });
    } else if (dataType === 'other_categories') {
      const data = row.data as CategoryData;
      otherCategories.push({
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        count: Number(data.count),
      });
    } else if (dataType === 'project_alternatives') {
      const data = row.data as AlternativeData;
      projectAlternatives.push({
        id: data.id,
        name: data.name,
        slug: data.slug,
        faviconUrl: data.faviconUrl,
      });
    }
  }

  return {
    projectCategories,
    otherCategories,
    projectAlternatives,
  };
};
