import { handleProjectCreated } from '@/functions/project-created';
import { handleProjectStatsUpdate, updateGitHubStats } from '@/functions/repo-stats';
import { inngest } from '@/services/inngest';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleProjectCreated, updateGitHubStats, handleProjectStatsUpdate],
});
