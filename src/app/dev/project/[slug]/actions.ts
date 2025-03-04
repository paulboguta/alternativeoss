'use server';
import { updateProject } from '@/data-access/project';
import { adminAction } from '@/lib/safe-action';
import { updateProjectFormSchema } from '@/types/project';
import { revalidateTag } from 'next/cache';

export const updateProjectAction = adminAction
  .createServerAction()
  .input(updateProjectFormSchema)
  .handler(async ({ input }) => {
    try {
      const { slug, ...data } = input;

      const updatedProject = await updateProject(slug, data);

      if (!updatedProject) {
        throw new Error('Project not found');
      }

      // Revalidate project page
      revalidateTag(`project/${slug}`);

      // Revalidate projects page if important fields are updated
      if (data.isLive || data.isScheduled || data.name) {
        revalidateTag(`projects`);
      }

      return {
        success: true,
        message: 'Project updated successfully!',
        project: updatedProject,
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  });
