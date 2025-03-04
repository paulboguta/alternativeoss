import { db } from '@/db';
import { categories, projectCategories, projects } from '@/db/schema';
import { generateSlug } from '@/utils/slug';
import { eq, sql } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache';

export const checkIfCategoryExists = async (name: string) => {
  const category = await db.query.categories.findFirst({
    where: eq(categories.name, name),
  });

  return !!category;
};

export const createCategory = async (name: string) => {
  const category = await db
    .insert(categories)
    .values({ name, slug: generateSlug(name) })
    .returning();

  return category[0];
};

export const getCategories = async () => {
  'use cache';
  cacheTag('categories');

  const result = await db.select().from(categories);

  return result;
};

export const getCategoriesWithCount = async ({ limit }: { limit?: number } = {}) => {
  const query = db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      count: sql<number>`COUNT(CASE WHEN ${projects.isLive} = true THEN ${projectCategories.projectId} END)::int`,
    })
    .from(categories)
    .leftJoin(projectCategories, eq(categories.id, projectCategories.categoryId))
    .leftJoin(projects, eq(projectCategories.projectId, projects.id))
    .groupBy(categories.id, categories.name, categories.slug)
    .having(
      sql`COUNT(CASE WHEN ${projects.isLive} = true THEN ${projectCategories.projectId} END) > 0`
    )
    .orderBy(
      sql`COUNT(CASE WHEN ${projects.isLive} = true THEN ${projectCategories.projectId} END) DESC`
    );

  if (limit) {
    query.limit(limit);
  }

  const result = await query;

  return result;
};

export const getCategory = async (slug: string) => {
  'use cache';
  cacheTag(`category/${slug}`);

  const category = await db.select().from(categories).where(eq(categories.slug, slug));

  return category[0];
};

export const updateProjectCategories = async (projectId: number, categoriesIds: number[]) => {
  // First delete existing relationships
  await db.delete(projectCategories).where(eq(projectCategories.projectId, projectId));

  // Then insert new ones
  if (categoriesIds.length > 0) {
    await db
      .insert(projectCategories)
      .values(categoriesIds.map(categoryId => ({ projectId, categoryId })));
  }

  // Revalidate cache tags
  revalidateTag(`project-categories/${projectId}`);
  revalidateTag(`other-categories/${projectId}`);
  revalidateTag('categories');
  revalidateTag('categories-with-count');
};
