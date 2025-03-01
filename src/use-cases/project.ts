import { DEFAULT_SORT_PROJECTS } from '@/config/sorting';
import {
  addAlternativeToProject,
  addProjectToCategory,
  createProject,
  findProject,
  getProjects,
  updateProjectContent,
  updateProjectRepoStats,
} from '@/data-access/project';
import { projects } from '@/db/schema';
import { NewProject } from '@/db/types';
import { eq, or, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from 'next/cache';
export const checkIfProjectExistsUseCase = async (slug: string) => {
  return findProject(eq(projects.slug, slug));
};

export const checkIfProjectExistsByUrlsUseCase = async (websiteUrl?: string, repoUrl?: string) => {
  if (!websiteUrl && !repoUrl) return false;

  let condition = sql`FALSE`;

  if (websiteUrl) {
    condition = or(condition, eq(projects.url, websiteUrl))!;
  }

  if (repoUrl) {
    condition = or(condition, eq(projects.repoUrl, repoUrl))!;
  }

  return findProject(condition);
};

export const createProjectUseCase = async (project: NewProject) => {
  try {
    const newProject = await createProject(project);
    revalidateTag('projects');

    return newProject;
  } catch (error) {
    throw new Error(`Failed to create project: ${error}`);
  }
};

export const updateProjectRepoStatsUseCase = async (
  slug: string,
  stats: {
    stars: number;
    forks: number;
    createdAt: string;
    lastCommit: string;
  }
) => {
  const updatedProject = await updateProjectRepoStats(slug, stats);

  // Invalidate project-specific cache
  revalidateTag(`project/${slug}`);

  return updatedProject;
};

export const updateProjectContentUseCase = async (
  slug: string,
  content: {
    summary: string;
    longDescription: string;
    features: string[];
  }
) => {
  const project = await updateProjectContent(slug, content);

  // Invalidate project-specific cache
  revalidateTag(`project/${slug}`);

  return project;
};

export const addProjectToCategoryUseCase = async (projectId: number, categoryId: number) => {
  await addProjectToCategory(projectId, categoryId);

  revalidateTag(`project/${projectId}`);
  revalidateTag(`category/${categoryId}`);
};

export const addAlternativeToProjectUseCase = async (projectId: number, alternativeId: number) => {
  await addAlternativeToProject(projectId, alternativeId);

  revalidateTag(`project/${projectId}`);
  revalidateTag(`alternative/${alternativeId}`);
};

export const getProjectsUseCase = async ({
  searchQuery = '',
  page = 1,
  limit = 10,
  sortField = DEFAULT_SORT_PROJECTS.field,
  sortDirection = DEFAULT_SORT_PROJECTS.direction,
  filters = {},
}: {
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  filters?: Record<string, unknown>;
}) => {
  'use cache';

  cacheTag('projects');
  cacheLife('max');

  const performanceCheck = performance.now();

  const { projects: projectsResult, pagination } = await getProjects({
    searchQuery,
    page,
    limit,
    sortField,
    sortDirection,
    // TODO: Apply filters when implemented
    filters,
  });

  console.log(`Projects fetched in ${performance.now() - performanceCheck}ms`);
  console.log(
    `Additional parameters: ${JSON.stringify({
      searchQuery,
      page,
      limit,
      sortField,
      sortDirection,
      filters,
    })}`
  );
  return {
    projects: projectsResult,
    pagination,
    sorting: {
      field: sortField,
      direction: sortDirection,
    },
  };
};
