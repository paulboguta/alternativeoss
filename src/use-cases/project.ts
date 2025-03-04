import { generateProjectAlternatives } from '@/ai/alternatives';
import { generateProjectCategories } from '@/ai/category';
import { extractJsonFromResponse } from '@/ai/core';
import { generateProjectSummary } from '@/ai/project-summary';
import { DEFAULT_SORT_PROJECTS } from '@/config/sorting';
import {
  getAlternativeByName,
  getAlternatives,
  updateProjectAlternatives,
} from '@/data-access/alternative';
import { createCategory, getCategories, updateProjectCategories } from '@/data-access/category';
import {
  addAlternativeToProject,
  addProjectToCategory,
  createProject,
  findProject,
  getProject,
  getProjects,
  updateProject,
} from '@/data-access/project';
import { projects } from '@/db/schema';
import { NewProject } from '@/db/types';
import { getFaviconUrl } from '@/lib/favicon';
import { getGitHubStats } from '@/services/github';
import { generateSlug } from '@/utils/slug';
import { eq, or, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from 'next/cache';
import { createAlternativeUseCase } from './alternative';
import { updateLicenseProjectUseCase } from './license';

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

export const launchProjectUseCase = async (slug: string) => {
  revalidateTag(`projects`);

  return updateProject(slug, {
    isScheduled: false,
    isLive: true,
    scheduledAt: null,
  });
};

export const updateProjectRepoStatsUseCase = async (
  slug: string,
  repoUrl: string,
  projectId: number
) => {
  revalidateTag(`project/${slug}`);

  const repoStats = await getGitHubStats(repoUrl);

  let licensePromise;

  // Update license immediately if available
  if (repoStats.license?.key) {
    licensePromise = updateLicenseProjectUseCase(repoStats.license.key, projectId);
  } else {
    // If no license found, use a default license
    licensePromise = updateLicenseProjectUseCase('unknown', projectId);
  }

  const projectPromise = updateProject(slug, {
    repoStars: repoStats.stars,
    repoForks: repoStats.forks,
    repoCreatedAt: new Date(repoStats.createdAt),
    repoLastCommit: new Date(repoStats.lastCommit),
  });

  const [license, project] = await Promise.all([licensePromise, projectPromise]);

  return { license, project };
};

export const createProjectContentUseCase = async ({
  name,
  url,
  ai_description,
  slug,
}: {
  name: string;
  url: string;
  ai_description?: string;
  slug: string;
}) => {
  const content = await generateProjectSummary(name, url, ai_description);

  const { summary, longDescription, features } = extractJsonFromResponse(content);

  const project = await updateProject(slug, {
    summary,
    longDescription,
    features,
  });

  // Invalidate project-specific cache
  revalidateTag(`project/${slug}`);

  return project;
};

export const createProjectCategoriesUseCase = async ({
  name,
  slug,
  ai_description,
}: {
  name: string;
  slug: string;
  ai_description?: string;
}) => {
  const [project, categories] = await Promise.all([getProject(slug), getCategories()]);

  if (!project) {
    throw new Error('Project not found');
  }

  const projectCategories = await generateProjectCategories(
    name,
    categories.map(category => category.name),
    ai_description
  );

  const { categories: assignedCategoryNames, categoriesToAdd } =
    extractJsonFromResponse(projectCategories);

  // Map assigned category names to their IDs
  const assignedCategoryIds = assignedCategoryNames
    .map((name: string) => categories.find(c => c.name === name)?.id)
    .filter((id: number | undefined): id is number => id !== undefined);

  const categoriesToAddIds = await Promise.all(
    categoriesToAdd.map((category: string) => createCategory(category))
  ).then(categories => categories.map(category => category.id));

  const allCategoryIds = [...assignedCategoryIds, ...categoriesToAddIds];

  await updateProjectCategories(project.id, allCategoryIds);
};

export const createProjectAlternativesUseCase = async ({
  name,
  projectId,
  ai_description,
}: {
  name: string;
  projectId: number;
  ai_description?: string;
}) => {
  const { alternatives } = await getAlternatives({});

  const projectAlternatives = await generateProjectAlternatives(
    name,
    alternatives.map(alternative => alternative.name),
    ai_description
  );

  const { alternatives: assignedAlternativeNames, alternativesToAdd } =
    extractJsonFromResponse(projectAlternatives);

  // Map assigned alternative names to their IDs
  const assignedAlternativeIds = assignedAlternativeNames
    .map((name: string) => alternatives.find(a => a.name === name)?.id)
    .filter((id: number | undefined): id is number => id !== undefined);

  const alternativesToAddIds = await Promise.all(
    alternativesToAdd.map(async (alternative: { name: string; url: string }) => {
      const existing = await getAlternativeByName(alternative.name);

      if (existing) {
        return existing.id;
      }

      const slug = generateSlug(alternative.name);
      const faviconUrl = alternative.url ? getFaviconUrl(alternative.url) : null;

      const created = await createAlternativeUseCase({
        name: alternative.name,
        url: alternative.url,
        slug,
        faviconUrl: faviconUrl ?? '',
      });

      if (!created) {
        throw new Error('Failed to create alternative');
      }

      return created.id;
    })
  );

  const allAlternativeIds = [...assignedAlternativeIds, ...alternativesToAddIds];

  await updateProjectAlternatives(projectId, allAlternativeIds);
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
