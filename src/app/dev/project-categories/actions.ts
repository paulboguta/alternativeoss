'use server';

import { db } from '@/db';
import { projectCategories, projects } from '@/db/schema';
import { adminAction } from '@/lib/safe-action';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const projectCategorySchema = z.object({
  projectId: z.number(),
  categoryId: z.number(),
});

export const connectProjectCategoryAction = adminAction
  .createServerAction()
  .input(projectCategorySchema)
  .handler(async ({ input }) => {
    try {
      const { projectId, categoryId } = input;
      const project = await db.select().from(projects).where(eq(projects.id, projectId));

      if (!project[0]) {
        throw new Error('Project not found');
      }

      revalidateTag(`project/${project[0].slug}`);

      const existingConnection = await db
        .select()
        .from(projectCategories)
        .where(
          and(
            eq(projectCategories.projectId, projectId),
            eq(projectCategories.categoryId, categoryId)
          )
        )
        .limit(1);

      if (existingConnection.length > 0) {
        throw new Error('Connection already exists');
      }

      await db.insert(projectCategories).values({
        projectId,
        categoryId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error connecting project to category:', error);
      throw error;
    }
  });

export const disconnectProjectCategoryAction = adminAction
  .createServerAction()
  .input(projectCategorySchema)
  .handler(async ({ input }) => {
    try {
      const { projectId, categoryId } = input;

      await db
        .delete(projectCategories)
        .where(
          and(
            eq(projectCategories.projectId, projectId),
            eq(projectCategories.categoryId, categoryId)
          )
        );

      return { success: true };
    } catch (error) {
      console.error('Error disconnecting project from category:', error);
      throw error;
    }
  });
