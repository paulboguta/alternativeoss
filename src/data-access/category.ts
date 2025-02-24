import { db } from "@/db";
import { categories, projectCategories } from "@/db/schema";
import { generateSlug } from "@/utils/slug";
import { eq } from "drizzle-orm";

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
  categoriesIds: number[]
) => {
  await db
    .insert(projectCategories)
    .values(categoriesIds.map((categoryId) => ({ projectId, categoryId })));
};
