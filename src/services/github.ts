import { env } from "@/env";
import { Octokit } from "octokit";

const githubClient = new Octokit({ auth: env.GITHUB_TOKEN });

export async function getGitHubStats(repoUrl: string) {
  const urlParts = repoUrl
    .replace("https://github.com/", "")
    .replace(".git", "")
    .split("/");

  const [owner, repo] = urlParts;

  if (!owner || !repo) {
    throw new Error("Invalid repository URL");
  }

  const { data } = await githubClient.rest.repos.get({ owner, repo });

  const repoStats = {
    forks: data.forks_count,
    stars: data.stargazers_count,
    lastCommit: data.pushed_at,
    createdAt: data.created_at,
    license: {
      name: data.license?.name,
      key: data.license?.key,
    },
  };

  return repoStats;
}
