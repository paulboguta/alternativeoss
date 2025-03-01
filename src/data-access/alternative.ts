import { DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';
import { db } from '@/db';
import { alternatives, projectAlternatives, projects } from '@/db/schema';
import { generateSlug } from '@/utils/slug';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache';

export const checkIfAltenativeExists = async (name: string) => {
  const alternative = await db.select().from(alternatives).where(eq(alternatives.name, name));

  return !!alternative;
};

export const getAllAlternatives = async () => {
  const result = await db.select({ slug: alternatives.slug }).from(alternatives);

  return result;
};

export const getAlternativeByName = async (name: string) => {
  const alternative = await db.select().from(alternatives).where(eq(alternatives.name, name));

  return alternative[0];
};

export const createAlternative = async (
  name: string,
  url: string,
  slug: string = generateSlug(name),
  faviconUrl: string | null = null,
  price?: number | null,
  pricingModel?: string | null,
  isPaid: boolean = true
) => {
  const alternative = await db
    .insert(alternatives)
    .values({
      name,
      url,
      slug,
      faviconUrl,
      price: price ?? null,
      pricingModel: pricingModel ?? null,
      isPaid,
    })
    .returning();

  return alternative[0];
};

export const getAlternative = async (slug: string) => {
  'use cache';
  cacheTag(`alternative/${slug}`);

  const alternative = await db.select().from(alternatives).where(eq(alternatives.slug, slug));

  return alternative[0];
};

export const getAlternatives = async ({
  searchQuery = '',
  page = 1,
  limit = 10,
  sortField = DEFAULT_SORT_ALTERNATIVES.field,
  sortDirection = DEFAULT_SORT_ALTERNATIVES.direction,
}: {
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
}) => {
  // !! unify orderByClause this + project.ts

  // Build the ORDER BY clause
  const orderByClause = (() => {
    console.log(sortField, sortDirection);
    if (sortField === 'name') {
      return sortDirection === 'asc' ? sql`alternatives.name ASC` : sql`alternatives.name DESC`;
    }

    if (sortField === 'projectCount') {
      return sortDirection === 'asc'
        ? sql`COUNT(${projectAlternatives.projectId}) ASC`
        : sql`COUNT(${projectAlternatives.projectId}) DESC`;
    }

    // if (sortField === 'repoLastCommit') {
    //   return sortDirection === 'asc'
    //     ? sql`alternatives.repo_last_commit ASC`
    //     : sql`alternatives.repo_last_commit DESC`;
    // }

    return sortDirection === 'asc'
      ? sql`alternatives.created_at ASC`
      : sql`alternatives.created_at DESC`;
  })();

  // Build the WHERE condition
  let condition = sql`TRUE`;

  // Apply search if query exists
  if (searchQuery && searchQuery.trim()) {
    // For full-text search using the search_vector column
    const searchCondition = sql`alternatives.search_vector @@ plainto_tsquery('english', ${searchQuery})`;

    // Fallback to ILIKE search for partial matches
    const fallbackCondition = or(
      ilike(alternatives.name, `%${searchQuery}%`),
      ilike(alternatives.summary, `%${searchQuery}%`)
    );

    // Combine both conditions with OR
    condition = or(searchCondition, fallbackCondition)!;
  }

  const selectFields = {
    id: alternatives.id,
    name: alternatives.name,
    slug: alternatives.slug,
    summary: alternatives.summary,
    // count how many projects are using the alternative
    projectCount: sql<number>`COUNT(${projectAlternatives.projectId})::int`,
    // get the favicon urls of the projects that are using the alternative
    projectFaviconUrls: sql<string[]>`ARRAY_AGG(${projects.faviconUrl})`,
    faviconUrl: alternatives.faviconUrl,
  };

  // Add rank field for search queries
  if (searchQuery && searchQuery.trim()) {
    Object.assign(selectFields, {
      rank: sql<number>`ts_rank(alternatives.search_vector, plainto_tsquery('english', ${searchQuery}))`,
    });
  }

  const resultsPromise = db
    .select(selectFields)
    .from(alternatives)
    // inner join to ensure only alternatives with projects are included
    .innerJoin(projectAlternatives, eq(alternatives.id, projectAlternatives.alternativeId))
    // inner join to get the favicon urls of the projects that are using the alternative
    .innerJoin(projects, eq(projectAlternatives.projectId, projects.id))
    .groupBy(alternatives.id, alternatives.name, alternatives.slug)
    .orderBy(orderByClause)
    .where(condition)
    .limit(limit)
    .offset((page - 1) * limit);

  const totalCountPromise = db.$count(alternatives, condition);

  // Execute both queries in parallel for better performance
  const [results, totalCount] = await Promise.all([resultsPromise, totalCountPromise]);

  return {
    alternatives: results,
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  };
};

export const updateProjectAlternatives = async (projectId: number, alternativesIds: number[]) => {
  // First delete existing relationships
  await db.delete(projectAlternatives).where(eq(projectAlternatives.projectId, projectId));

  // Then insert new ones
  if (alternativesIds.length > 0) {
    await db.insert(projectAlternatives).values(
      alternativesIds.map(alternativeId => ({
        projectId,
        alternativeId,
      }))
    );
  }

  revalidateTag(`project/${projectId}`);
  revalidateTag('alternatives');
};

export const updateAlternativeDescription = async (id: number, description: string) => {
  const alternative = await db
    .update(alternatives)
    .set({ description })
    .where(eq(alternatives.id, id));

  return alternative;
};
