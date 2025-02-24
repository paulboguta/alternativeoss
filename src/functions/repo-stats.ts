import { db } from "@/db";
import { projects } from "@/db/schema";
import { getGitHubStats } from "@/services/github";
import { inngest } from "@/services/inngest";
import { eq } from "drizzle-orm";

// This function will run every 24 hours to update GitHub repository stats
export const updateGitHubStats = inngest.createFunction(
  { id: "update-github-stats" },
  { cron: "TZ=Europe/Paris 0 0 * * *" },
  async ({ step }) => {
    // Load all projects that have GitHub URLs
    const allProjects = await step.run("load-projects", async () => {
      return db.query.projects.findMany({
        where: (projects, { isNotNull }) => isNotNull(projects.repoUrl),
      });
    });

    // Create events for each project that needs updating
    const events = allProjects
      .filter((project) => project.repoUrl?.includes("github.com"))
      .map((project) => ({
        name: "app/update.project.stats",
        data: {
          projectId: project.id,
          repoUrl: project.repoUrl!,
        },
      }));

    // Send all events in a batch
    if (events.length > 0) {
      await step.sendEvent("send-update-events", events);
    }

    return {
      projectsToUpdate: events.length,
    };
  }
);

// This function handles updating stats for each project
export const handleProjectStatsUpdate = inngest.createFunction(
  { id: "handle-project-stats-update" },
  { event: "app/update.project.stats" },
  async ({ event, step }) => {
    const { projectId, repoUrl } = event.data;

    // Fetch GitHub stats
    const repoStats = await step.run("fetch-github-stats", async () => {
      return getGitHubStats(repoUrl);
    });

    if (!repoStats) {
      return { success: false, error: "Failed to fetch GitHub stats" };
    }

    // Update project stats in database
    await step.run("update-project-stats", async () => {
      return db
        .update(projects)
        .set({
          repoStars: repoStats.stars,
          repoForks: repoStats.forks,
          repoCreatedAt: new Date(repoStats.createdAt),
          repoLastCommit: new Date(repoStats.lastCommit),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));
    });

    return {
      success: true,
      projectId,
      stats: repoStats,
    };
  }
);
