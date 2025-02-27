import { SortDirection, SortField } from '@/config/sorting';
import {
  addAlternativeToProject,
  addProjectToCategory,
  createProject,
  findProject,
  findProjects,
  updateProjectContent,
  updateProjectRepoStats,
} from '@/data-access/project';
import { projects } from '@/db/schema';
import { NewProject } from '@/db/types';
import { asc, desc, eq, or, sql } from 'drizzle-orm';
import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache';

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
    revalidateTag(`projects-count`);
    revalidateTag(`projects-page-1`);

    if (newProject) {
      revalidateTag(`project/${newProject.slug}`);
      revalidateTag(`project-repo-stats/${newProject.id}`);
    }
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

  // Invalidate relevant cache tags
  revalidateTag(`project-categories/${projectId}`);
  revalidateTag(`other-categories/${projectId}`);
  revalidateTag('categories');
};

export const addAlternativeToProjectUseCase = async (projectId: number, alternativeId: number) => {
  await addAlternativeToProject(projectId, alternativeId);

  // Invalidate relevant cache tags
  revalidateTag(`project-alternatives/${projectId}`);
  revalidateTag(`alternative/${alternativeId}`);
};

export const getSortedProjectsUseCase = async (
  page: number = 1,
  limit: number = 10,
  sortField: SortField = 'createdAt',
  sortDirection: SortDirection = 'desc'
) => {
  'use cache';

  cacheTag(`projects-page-${page}-sort-${sortField}-${sortDirection}`);

  const offset = (page - 1) * limit;

  let orderByClause;
  if (sortField === 'name') {
    orderByClause = sortDirection === 'asc' ? asc(projects.name) : desc(projects.name);
  }

  if (sortField === 'repoStars') {
    orderByClause = sortDirection === 'asc' ? asc(projects.repoStars) : desc(projects.repoStars);
  }

  if (sortField === 'repoLastCommit') {
    orderByClause =
      sortDirection === 'asc' ? asc(projects.repoLastCommit) : desc(projects.repoLastCommit);
  }

  if (sortField === 'createdAt') {
    orderByClause = sortDirection === 'asc' ? asc(projects.createdAt) : desc(projects.createdAt);
  }

  // Get the projects with sorting
  const projectsResult = await findProjects(
    {
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      url: projects.url,
      repoStars: projects.repoStars,
      repoLastCommit: projects.repoLastCommit,
      summary: projects.summary,
    },
    sql`TRUE`,
    orderByClause,
    limit,
    offset
  );

  // Get total count for pagination
  const countResult = await findProjects({ count: sql<number>`count(*)` }, sql`TRUE`);

  const totalCount = countResult[0]?.count ? Number(countResult[0].count) : 0;

  return {
    projects: projectsResult,
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
    sorting: {
      field: sortField,
      direction: sortDirection,
    },
  };
};
