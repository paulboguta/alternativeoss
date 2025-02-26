'use client';

import { createProjectAction } from '@/app/dev/projects/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createProjectFormSchema, type CreateProjectForm } from '@/types/project';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { LoaderButton } from '../../loader-button';

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: '',
      url: '',
      repoUrl: '',
      affiliateCode: '',
      ai_description: '',
    },
  });

  const { execute, isPending } = useServerAction(createProjectAction, {
    onSuccess: () => {
      form.reset();
      if (onSuccess) onSuccess();
    },
  });

  function onSubmit(values: CreateProjectForm) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affiliateCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional affiliate code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ai_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional context for AI to better understand the project" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoaderButton isPending={isPending}>Create Project</LoaderButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
