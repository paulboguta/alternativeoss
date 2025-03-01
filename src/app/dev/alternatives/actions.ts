'use server';

import { getFaviconUrl } from '@/lib/favicon';
import { adminAction } from '@/lib/safe-action';
import { createAlternativeFormSchema } from '@/types/alternative';
import { createAlternativeUseCase } from '@/use-cases/alternative';
import { generateSlug } from '@/utils/slug';

export const createAlternativeAction = adminAction
  .createServerAction()
  .input(createAlternativeFormSchema)
  .handler(async ({ input }) => {
    try {
      const { name, url } = input;
      const slug = generateSlug(name);

      // Generate favicon URL if URL is provided
      const faviconUrl = url ? getFaviconUrl(url) : null;

      const alternative = await createAlternativeUseCase({
        name,
        url: url || '',
        slug,
        faviconUrl: faviconUrl || '',
      });

      return {
        success: true,
        message: 'Alternative created successfully!',
        data: alternative,
      };
    } catch (error) {
      console.error('Error creating alternative:', error);
      return {
        success: false,
        message: 'An error occurred while creating the alternative.',
      };
    }
  });
