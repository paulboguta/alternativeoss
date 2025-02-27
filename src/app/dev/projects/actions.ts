'use server';

import { sendCreateProjectEvent } from '@/functions/project-created';
import { adminAction } from '@/lib/safe-action';
import { createProjectFormSchema } from '@/types/project';
import { checkIfProjectExistsUseCase } from '@/use-cases/project';
import { generateSlug } from '@/utils/slug';

export const createProjectAction = adminAction
  .createServerAction()
  .input(createProjectFormSchema)
  .handler(async ({ input }) => {
    const slug = generateSlug(input.name);

    const exists = await checkIfProjectExistsUseCase(slug);

    if (exists) {
      throw new Error('Project already exists');
    }

    await sendCreateProjectEvent(input);

    return {
      success: true,
      message: 'Project creation initiated successfully!',
    };
  });
