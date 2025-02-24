"use client";

import { createProjectAction } from "@/app/dev/create-project/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createProjectFormSchema,
  type CreateProjectForm,
} from "@/types/project";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export function CreateProjectForm() {
  const form = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      url: "",
      repoUrl: "",
      affiliateCode: "",
    },
  });

  const { execute } = useServerAction(createProjectAction);

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

            <Button type="submit">Create Project</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
