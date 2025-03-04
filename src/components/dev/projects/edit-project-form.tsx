'use client';

import { updateProjectAction } from '@/app/dev/project/[slug]/actions';
import { LoaderButton } from '@/components/loader-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker24h } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UpdateProjectForm, updateProjectFormSchema } from '@/types/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

type Project = {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  longDescription: string | null;
  features: string[] | null;
  url: string | null;
  repoUrl: string | null;
  affiliateCode: string | null;
  isFeatured: boolean;
  isLive: boolean;
  isScheduled: boolean;
  scheduledAt: Date | null;
};

type EditProjectFormProps = {
  project: Project;
  onSuccess?: () => void;
};

export function EditProjectForm({ project, onSuccess }: EditProjectFormProps) {
  const form = useForm<UpdateProjectForm>({
    resolver: zodResolver(updateProjectFormSchema),
    defaultValues: {
      slug: project.slug,
      name: project.name,
      url: project.url || '',
      repoUrl: project.repoUrl || '',
      affiliateCode: project.affiliateCode || '',
      summary: project.summary || '',
      longDescription: project.longDescription || '',
      features: project.features || [],
      isFeatured: project.isFeatured,
      isLive: project.isLive,
      isScheduled: project.isScheduled,
      scheduledAt: project.scheduledAt,
    },
  });

  const { execute, isPending } = useServerAction(updateProjectAction, {
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  function onSubmit(values: UpdateProjectForm) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
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
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of the project"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the project"
                      className="min-h-[150px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Features of the project"
                      className="min-h-[150px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isLive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Live</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isScheduled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Scheduled</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Launch Date</FormLabel>
                  <FormControl>
                    <DateTimePicker24h date={field.value || new Date()} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoaderButton isPending={isPending}>Update Project</LoaderButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
