import { generateProjectCategories } from "@/ai/category";
import { extractJsonFromResponse } from "@/ai/core";
import { generateProjectSummary } from "@/ai/project-summary";
import {
  createCategory,
  getCategories,
  updateProjectCategories,
} from "@/data-access/category";
import {
  createProject,
  getProject,
  updateProjectContent,
  updateProjectRepoStats,
} from "@/data-access/project";

import { getGitHubStats } from "@/services/github";
import { inngest } from "@/services/inngest";
import { CreateProjectForm } from "@/types/project";
import { updateLicenseProjectUseCase } from "@/use-cases/license";
import { generateSlug } from "@/utils/slug";

export const sendCreateProjectEvent = async (data: CreateProjectForm) => {
  await inngest.send({
    name: "project/created",
    data,
  });
};

export const handleProjectCreated = inngest.createFunction(
  { id: "handle-project-created" },
  { event: "project/created" },
  async ({ event, step }) => {
    const { name, url, repoUrl, affiliateCode } = event.data;

    if (!url || !name || !repoUrl) {
      throw new Error("Missing required fields");
    }

    const slug = generateSlug(name);

    await step.run("create-project", async () => {
      await createProject({
        name,
        slug,
        url,
        isScheduled: true,
        scheduledAt: new Date(Date.now() + 30 * 60 * 1000),
        affiliateCode,
        repoUrl,
      });
    });

    const updateRepoStats = step.run("get-repo-stats", async () => {
      const repoStats = await getGitHubStats(repoUrl);

      await updateProjectRepoStats(slug, repoStats);

      return repoStats;
    });

    const updateLicense = step.run("update-license", async () => {
      const repoStats = await getGitHubStats(repoUrl);

      if (!repoStats.license.key) {
        throw new Error("No license found");
      }

      const project = await getProject(slug);

      if (!project) {
        throw new Error("Project not found");
      }

      await updateLicenseProjectUseCase(repoStats.license.key, project.id);
    });

    const createProjectContent = step.run(
      "create-project-content",
      async () => {
        const content = await generateProjectSummary(name, url);

        const { summary, longDescription, features } =
          extractJsonFromResponse(content);

        const project = await updateProjectContent(slug, {
          summary,
          longDescription,
          features,
        });

        return project;
      }
    );

    const createProjectCategories = step.run(
      "create-project-categories",
      async () => {
        const categories = await getCategories();

        const project = await getProject(slug);

        if (!project) {
          throw new Error("Project not found");
        }

        const projectCategories = await generateProjectCategories(
          name,
          categories.map((category) => category.name)
        );

        const { categories: assignedCategories, categoriesToAdd } =
          extractJsonFromResponse(projectCategories);

        const categoriesToAddIds = await Promise.all(
          categoriesToAdd.map((category: string) => createCategory(category))
        );

        const allCategories = [...assignedCategories, ...categoriesToAddIds];

        await updateProjectCategories(project.id, allCategories);
      }
    );

    await Promise.all([
      updateRepoStats,
      updateLicense,
      createProjectContent,
      createProjectCategories,
    ]);

    return {
      name,
    };
  }
);
