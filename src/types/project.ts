import { z } from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  affiliateCode: z.string().optional(),
});

export type CreateProjectForm = z.infer<typeof createProjectFormSchema>;
