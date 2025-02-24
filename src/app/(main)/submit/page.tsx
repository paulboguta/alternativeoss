"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { submitProject } from "./actions";

type FormValues = {
  name: string;
  projectName: string;
  email: string;
  websiteUrl?: string;
  repoLink: string;
  description: string;
};

export const submitProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  repoLink: z.string().url("Invalid repository URL"),
  description: z.string().min(50, "Description must be at least 50 characters"),
});

export default function SubmitPage() {
  const { execute: runAction, status } = useServerAction(submitProject);
  const isPending = status === "pending";

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      projectName: "",
      email: "",
      websiteUrl: "",
      repoLink: "",
      description: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const [result, error] = await runAction(data);
      if (error) throw error;

      if (result?.success) {
        form.reset();
        // TODO: Show success toast
      }
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    }
  }

  return (
    <div className="px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight">
          Submit Your Project
        </h1>
        <p className="max-w-[550px] text-lg text-muted-foreground font-light leading-tight">
          Share your open source project with the AlternativeOSS community. Help
          others discover great open source alternatives.
        </p>
      </section>

      <section className="pb-24 max-w-2xl ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="John Doe"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  {...form.register("projectName")}
                  placeholder="My Awesome Project"
                />
                {form.formState.errors.projectName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.projectName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="john@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  {...form.register("websiteUrl")}
                  placeholder="https://myproject.com"
                />
                {form.formState.errors.websiteUrl && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoLink">Repository Link</Label>
                <Input
                  id="repoLink"
                  {...form.register("repoLink")}
                  placeholder="https://github.com/username/project"
                />
                {form.formState.errors.repoLink && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.repoLink.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Project Description (Optional)
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Tell us about your project..."
                className="h-32"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Project"}
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
