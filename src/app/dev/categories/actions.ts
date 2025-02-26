'use server';

import { checkIfCategoryExists, createCategory } from '@/data-access/category';
import { adminAction } from '@/lib/safe-action';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Category name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Category name must not be longer than 50 characters.',
    }),
});

export const createCategoryAction = adminAction
  .createServerAction()
  .input(createCategorySchema)
  .handler(async ({ input }) => {
    try {
      const { name } = input;

      // Check if category already exists
      const exists = await checkIfCategoryExists(name);
      if (exists) {
        return {
          success: false,
          message: 'A category with this name already exists',
        };
      }

      // Create the category
      const category = await createCategory(name);

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        message: 'Failed to create category',
      };
    }
  });
