import { db } from "@/db";
import { categories, projectCategories } from "@/db/schema";
import { generateSlug } from "@/utils/slug";
import { eq, sql } from "drizzle-orm";

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
  const result = await db.select().from(categories);

  return result;
};

export const getCategory = async (slug: string) => {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));

  return category[0];
};

export const updateProjectCategories = async (
  projectId: number,
  categories: { id: number; name: string }[]
) => {
  await db
    .insert(projectCategories)
    .values(
      categories.map((category) => ({ projectId, categoryId: category.id }))
    );
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
    .where(eq(projectCategories.projectId, projectId));

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
    .limit(limit);

  return result.map(({ categoryId, categoryName, count }) => ({
    categoryId,
    categoryName,
    count: Number(count),
  }));
};
