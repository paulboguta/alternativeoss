'use server';

import { createAlternative } from '@/data-access/alternative';
import { getFaviconUrl } from '@/lib/favicon';
import { adminAction } from '@/lib/safe-action';
import { createAlternativeFormSchema } from '@/types/alternative';
import { generateSlug } from '@/utils/slug';

export const createAlternativeAction = adminAction
  .createServerAction()
  .input(createAlternativeFormSchema)
  .handler(async ({ input }) => {
    try {
      const { name, url, price, pricingModel, isPaid } = input;
      const slug = generateSlug(name);

      // Generate favicon URL if URL is provided
      const faviconUrl = url ? getFaviconUrl(url) : null;

      const alternative = await createAlternative(
        name,
        url || '',
        slug,
        faviconUrl,
        price,
        pricingModel || null,
        isPaid
      );

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
