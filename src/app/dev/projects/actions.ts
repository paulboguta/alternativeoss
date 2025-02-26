'use server';

import { checkIfProjectExists } from '@/data-access/project';
import { sendCreateProjectEvent } from '@/functions/project-created';
import { adminAction } from '@/lib/safe-action';
import { createProjectFormSchema } from '@/types/project';
import { generateSlug } from '@/utils/slug';

export const createProjectAction = adminAction
  .createServerAction()
  .input(createProjectFormSchema)
  .handler(async ({ input }) => {
    const slug = generateSlug(input.name);

    const exists = await checkIfProjectExists(slug);

    if (exists) {
      throw new Error('Project already exists');
    }

    await sendCreateProjectEvent(input);

    return {
      success: true,
      message: 'Project creation initiated successfully!',
    };
  });
