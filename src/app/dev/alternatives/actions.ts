'use server';

import { db } from '@/db';
import { alternatives } from '@/db/schema';
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

      const alternative = await db.insert(alternatives).values({
        name,
        slug,
        url: url || null,
        price,
        pricingModel: pricingModel || null,
        isPaid,
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
