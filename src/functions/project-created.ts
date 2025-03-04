import { getFaviconUrl } from '@/lib/favicon';
import { generateScreenshot } from '@/lib/image';
import { inngest } from '@/services/inngest';
import { CreateProjectForm } from '@/types/project';
import {
  createProjectAlternativesUseCase,
  createProjectCategoriesUseCase,
  createProjectContentUseCase,
  createProjectUseCase,
  launchProjectUseCase,
  updateProjectRepoStatsUseCase,
} from '@/use-cases/project';
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
    const { name, url, repoUrl, affiliateCode, ai_description, scheduledAt } = event.data;

    if (!url || !name || !repoUrl) {
      throw new Error('Missing required fields');
    }

    const slug = generateSlug(name);

    // Generate favicon URL if URL is provided
    const faviconUrl = url ? getFaviconUrl(url) : undefined;

    // if no schedule date provided, set it at 1 day from now
    const DEFAULT_SCHEDULE_24H = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create the project first
    const newProject = await step.run('create-project', async () => {
      const newProject = await createProjectUseCase({
        name,
        slug,
        url,
        isScheduled: true,
        scheduledAt: new Date(scheduledAt) || DEFAULT_SCHEDULE_24H,
        affiliateCode,
        repoUrl,
        faviconUrl,
      });

      // Ensure the project is immediately available
      return newProject;
    });

    if (!newProject) {
      throw new Error('Failed to create project');
    }

    // Get repo stats and update license
    const updateLicenseAndStats = step.run('update-license-and-stats', async () => {
      const repoStats = await updateProjectRepoStatsUseCase(slug, repoUrl, newProject.id);

      return repoStats;
    });

    // * CLAUDE SONNET POWERED
    // Generate project tagline, description, features using AI
    const createProjectContent = step.run('create-project-content', async () => {
      return createProjectContentUseCase({
        name,
        url,
        ai_description,
        slug,
      });
    });

    // * CLAUDE SONNET POWERED
    // Create project categories using AI
    const createProjectCategories = step.run('create-project-categories', async () => {
      return createProjectCategoriesUseCase({
        name: newProject.name,
        slug,
      });
    });

    // * CLAUDE SONNET POWERED
    // Create project alternatives using AI
    const createProjectAlternatives = step.run('create-project-alternatives', async () => {
      return await createProjectAlternativesUseCase({
        name: newProject.name,
        projectId: newProject.id,
        ai_description,
      });
    });

    const createProjectScreenshot = step.run('generate-screenshot', async () => {
      await generateScreenshot(url, slug);
    });

    await Promise.all([
      updateLicenseAndStats,
      createProjectContent,
      createProjectCategories,
      createProjectAlternatives,
      createProjectScreenshot,
    ]);

    // Wait for the project's scheduled launch time
    if (newProject.scheduledAt) {
      await step.sleepUntil('wait-for-scheduled-launch', new Date(newProject.scheduledAt));

      await step.run('launch-project', async () => {
        await launchProjectUseCase(slug);
      });
    }

    return {
      name,
    };
  }
);
