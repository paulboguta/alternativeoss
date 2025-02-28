import { db } from '@/db';
import { projects } from '@/db/schema';
import { getGitHubStats } from '@/services/github';
import { inngest } from '@/services/inngest';
import { eq } from 'drizzle-orm';

// Batch size for processing projects
const BATCH_SIZE = 50;

// This function will run every 24 hours to update GitHub repository stats
export const updateGitHubStats = inngest.createFunction(
  { id: 'update-github-stats' },
  { cron: 'TZ=Europe/Paris 0 0 * * *' },
  async ({ step }) => {
    // Load all projects that have GitHub URLs
    const allProjects = await step.run('load-projects', async () => {
      return db.query.projects.findMany({
        where: (projects, { isNotNull }) => isNotNull(projects.repoUrl),
      });
    });

    // Filter projects with GitHub URLs
    const githubProjects = allProjects.filter(p => p.repoUrl?.includes('github.com'));

    // Create batches of projects
    const batches = [];
    for (let i = 0; i < githubProjects.length; i += BATCH_SIZE) {
      batches.push(githubProjects.slice(i, i + BATCH_SIZE));
    }

    // Process each batch directly instead of sending events
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      if (!batch) continue;

      await step.run(`process-batch-${i + 1}`, async () => {
        console.log(`Processing batch ${i + 1}/${batches.length} with ${batch.length} projects`);

        for (const project of batch) {
          try {
            // Fetch GitHub stats
            const repoStats = await getGitHubStats(project.repoUrl!);

            if (!repoStats) {
              console.log(`Failed to fetch GitHub stats for project ${project.id}`);
              continue;
            }

            // Update project stats in database
            await db
              .update(projects)
              .set({
                repoStars: repoStats.stars,
                repoForks: repoStats.forks,
                repoCreatedAt: new Date(repoStats.createdAt),
                repoLastCommit: new Date(repoStats.lastCommit),
                updatedAt: new Date(),
              })
              .where(eq(projects.id, project.id));

            console.log(
              `Updated stats for project ${project.id}: ${repoStats.stars} stars, ${repoStats.forks} forks`
            );
          } catch (error) {
            console.error(`Error updating project ${project.id}:`, error);
          }
        }
      });
    }

    return {
      projectsToUpdate: githubProjects.length,
      batchesProcessed: batches.length,
    };
  }
);

// Handler for individual project updates (for manual triggers)
export const handleProjectStatsUpdate = inngest.createFunction(
  { id: 'handle-project-stats-update' },
  { event: 'project/update.stats' },
  async ({ event, step }) => {
    const { projectId, repoUrl } = event.data;

    console.log('Handle Project Stats projectId', projectId);

    // Fetch GitHub stats
    const repoStats = await step.run('fetch-github-stats', async () => {
      return getGitHubStats(repoUrl);
    });

    if (!repoStats) {
      return { success: false, error: 'Failed to fetch GitHub stats' };
    }

    // Update project stats in database
    await step.run('update-project-stats', async () => {
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
