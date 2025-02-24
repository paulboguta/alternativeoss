import { z } from "zod";

export const submitProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  repoLink: z.string().url("Invalid repository URL"),
  description: z.string().optional(),
});

export type SubmitProjectInput = z.infer<typeof submitProjectSchema>;

export type CreateSubmission = {
  name: string;
  projectName: string;
  email: string;
  websiteUrl?: string;
  repoLink: string;
  description?: string;
};
