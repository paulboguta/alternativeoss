'use server';

import { db } from '@/db';
import { projectAlternatives, projects } from '@/db/schema';
import { adminAction } from '@/lib/safe-action';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const projectAlternativeSchema = z.object({
  projectId: z.number(),
  alternativeId: z.number(),
});

export const connectProjectAlternativeAction = adminAction
  .createServerAction()
  .input(projectAlternativeSchema)
  .handler(async ({ input }) => {
    try {
      const { projectId, alternativeId } = input;
      const project = await db.select().from(projects).where(eq(projects.id, projectId));

      if (!project[0]) {
        throw new Error('Project not found');
      }

      revalidateTag(`project/${project[0].slug}`);

      const existingConnection = await db
        .select()
        .from(projectAlternatives)
        .where(
          and(
            eq(projectAlternatives.projectId, projectId),
            eq(projectAlternatives.alternativeId, alternativeId)
          )
        )
        .limit(1);

      if (existingConnection.length > 0) {
        throw new Error('Connection already exists');
      }

      await db.insert(projectAlternatives).values({
        projectId,
        alternativeId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error connecting project to alternative:', error);
      throw error;
    }
  });

export const disconnectProjectAlternativeAction = adminAction
  .createServerAction()
  .input(projectAlternativeSchema)
  .handler(async ({ input }) => {
    try {
      const { projectId, alternativeId } = input;

      await db
        .delete(projectAlternatives)
        .where(
          and(
            eq(projectAlternatives.projectId, projectId),
            eq(projectAlternatives.alternativeId, alternativeId)
          )
        );

      return { success: true };
    } catch (error) {
      console.error('Error disconnecting project from alternative:', error);
      throw error;
    }
  });
