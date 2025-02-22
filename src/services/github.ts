import { env } from "@/env";
import { Octokit } from "octokit";

const githubClient = new Octokit({ auth: env.GITHUB_TOKEN });

export async function getGitHubStats(repoUrl: string) {
  const urlParts = repoUrl
    .replace("https://github.com/", "")
    .replace(".git", "")
    .split("/");

  const [owner, repo] = urlParts;

  const { data } = await githubClient.rest.repos.get({ owner, repo });

  const repoStats = {
    forks: data.forks_count,
    stars: data.stargazers_count,
    lastCommit: data.pushed_at,
    createdAt: data.created_at,
  };

  return repoStats;
}
