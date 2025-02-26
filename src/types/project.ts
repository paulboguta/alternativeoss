import { z } from 'zod';

export const createProjectFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  url: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  affiliateCode: z.string().optional(),
  ai_description: z.string().optional(),
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
    (project.url === null || typeof project.url === 'string') &&
    (project.repoUrl === null || typeof project.repoUrl === 'string') &&
    typeof project.name === 'string' &&
    typeof project.slug === 'string' &&
    (project.summary === null || typeof project.summary === 'string') &&
    (project.longDescription === null || typeof project.longDescription === 'string') &&
    (project.features === null || Array.isArray(project.features))
  );
}
