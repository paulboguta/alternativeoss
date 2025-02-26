'use client';

import { createCategoryAction } from '@/app/dev/categories/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Category name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Category name must not be longer than 50 characters.',
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCategoryFormProps {
  onSuccess?: () => void;
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { execute, isPending } = useServerAction(createCategoryAction, {
    onSuccess: response => {
      if (response.data.success) {
        toast.success(response.data.message);
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data.message);
      }
    },
    onError: error => {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    },
  });

  function onSubmit(values: FormValues) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the category (e.g., &ldquo;Productivity&rdquo;, &ldquo;Design&rdquo;,
                  &ldquo;Development&rdquo;)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
}
