import { z } from 'zod';

export const createProjectFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  url: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  affiliateCode: z.string().optional(),
});

export type CreateProjectForm = z.infer<typeof createProjectFormSchema>;

export type RequiredProjectData = {
  id: number;
  url: string | null;
  repoUrl: string | null;
  name: string;
  slug: string;
  summary: string | null;
  longDescription: string | null;
  features: string[] | null;
};

export function isValidProjectData(project: RequiredProjectData): project is RequiredProjectData {
  return (
    !!project &&
    typeof project.id === 'number' &&
    typeof project.url === 'string' &&
    typeof project.repoUrl === 'string' &&
    typeof project.name === 'string' &&
    typeof project.summary === 'string' &&
    typeof project.longDescription === 'string' &&
    Array.isArray(project.features)
  );
}
