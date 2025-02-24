import { db } from "@/db";
import { alternatives, projectAlternatives } from "@/db/schema";
import { generateSlug } from "@/utils/slug";
import { eq } from "drizzle-orm";

export const checkIfAltenativeExists = async (name: string) => {
  const alternative = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.name, name));

  return !!alternative;
};

export const getAlternatives = async () => {
  const result = await db.select().from(alternatives);

  return result;
};

export const getAlternativeByName = async (name: string) => {
  const alternative = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.name, name));

  return alternative[0];
};

export const createAlternative = async (name: string, url: string) => {
  const alternative = await db
    .insert(alternatives)
    .values({ name, url, slug: generateSlug(name) })
    .returning();

  return alternative[0];
};

export const updateAlternativeDescription = async (
  id: number,
  description: string
) => {
  const alternative = await db
    .update(alternatives)
    .set({ description })
    .where(eq(alternatives.id, id));

  return alternative;
};

export const getAlternative = async (slug: string) => {
  const alternative = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.slug, slug));

  return alternative[0];
};

export const updateProjectAlternatives = async (
  projectId: number,
  alternativesIds: number[]
) => {
  // First delete existing relationships
  await db
    .delete(projectAlternatives)
    .where(eq(projectAlternatives.projectId, projectId));

  // Then insert new ones
  if (alternativesIds.length > 0) {
    await db.insert(projectAlternatives).values(
      alternativesIds.map((alternativeId) => ({
        projectId,
        alternativeId,
      }))
    );
  }
};
