import { generateProjectCategories } from '@/ai/category';
import { extractJsonFromResponse } from '@/ai/core';
import { generateProjectSummary } from '@/ai/project-summary';
import { createCategory, getCategories, updateProjectCategories } from '@/data-access/category';
import {
  createProject,
  getProject,
  updateProjectContent,
  updateProjectRepoStats,
} from '@/data-access/project';

import { generateProjectAlternatives } from '@/ai/alternatives';
import {
  createAlternative,
  getAlternativeByName,
  getAlternatives,
  updateProjectAlternatives,
} from '@/data-access/alternative';
import { generateScreenshot } from '@/lib/image';
import { getGitHubStats } from '@/services/github';
import { inngest } from '@/services/inngest';
import { CreateProjectForm } from '@/types/project';
import { updateLicenseProjectUseCase } from '@/use-cases/license';
import { generateSlug } from '@/utils/slug';

export const sendCreateProjectEvent = async (data: CreateProjectForm) => {
  await inngest.send({
    name: 'project/created',
    data,
  });
};

export const handleProjectCreated = inngest.createFunction(
  { id: 'handle-project-created' },
  { event: 'project/created' },
  async ({ event, step }) => {
    const { name, url, repoUrl, affiliateCode, ai_description } = event.data;

    if (!url || !name || !repoUrl) {
      throw new Error('Missing required fields');
    }

    const slug = generateSlug(name);

    // Create the project first
    const newProject = await step.run('create-project', async () => {
      const newProject = await createProject({
        name,
        slug,
        url,
        isScheduled: true,
        scheduledAt: new Date(Date.now() + 30 * 60 * 1000),
        affiliateCode,
        repoUrl,
      });

      // Ensure the project is immediately available
      return newProject;
    });

    if (!newProject) {
      throw new Error('Failed to create project');
    }

    // Get repo stats and update license immediately
    await step.run('update-license-and-stats', async () => {
      const repoStats = await getGitHubStats(repoUrl);

      // Update repo stats
      await updateProjectRepoStats(slug, repoStats);

      // Update license immediately if available
      if (repoStats.license?.key) {
        await updateLicenseProjectUseCase(repoStats.license.key, newProject.id);
      } else {
        // If no license found, use a default license
        await updateLicenseProjectUseCase('unknown', newProject.id);
      }

      return repoStats;
    });

    // Continue with the rest of the steps in parallel
    const createProjectContent = step.run('create-project-content', async () => {
      const content = await generateProjectSummary(name, url, ai_description);

      const { summary, longDescription, features } = extractJsonFromResponse(content);

      const project = await updateProjectContent(slug, {
        summary,
        longDescription,
        features,
      });

      return project;
    });

    // * CLAUDE SONNET POWERED
    const createProjectCategories = step.run('create-project-categories', async () => {
      const categories = await getCategories();

      const project = await getProject(slug);

      console.log('project', project);

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
    });

    // * CLAUDE SONNET POWERED
    const createProjectAlternatives = step.run('create-project-alternatives', async () => {
      const alternatives = await getAlternatives();

      const project = await getProject(slug);

      console.log('project', project);

      if (!project) {
        throw new Error('Project not found');
      }

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

          const created = await createAlternative(alternative.name, alternative.url);

          if (!created) {
            throw new Error('Failed to create alternative');
          }

          return created.id;
        })
      );

      const allAlternativeIds = [...assignedAlternativeIds, ...alternativesToAddIds];

      await updateProjectAlternatives(project.id, allAlternativeIds);
    });

    const createProjectScreenshot = step.run('generate-screenshot', async () => {
      await generateScreenshot(url, slug);
    });

    await Promise.all([
      createProjectContent,
      createProjectCategories,
      createProjectAlternatives,
      createProjectScreenshot,
    ]);

    return {
      name,
    };
  }
);
