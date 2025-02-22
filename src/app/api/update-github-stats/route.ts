import { db } from "@/db";
import { projects } from "@/db/schema";
import { getGitHubStats } from "@/services/github";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allProjects = await db.query.projects.findMany({
      where: (projects, { isNotNull }) => isNotNull(projects.repoUrl),
    });

    const updates = await Promise.all(
      allProjects.map(async (project) => {
        if (!project.repoUrl?.includes("github.com")) return null;

        const repoStats = await getGitHubStats(project.repoUrl);
        if (!repoStats) return null;

        return db
          .update(projects)
          .set({
            repoStars: repoStats.stars,
            repoForks: repoStats.forks,
            repoCreatedAt: new Date(repoStats.createdAt),
            repoLastCommit: new Date(repoStats.lastCommit),
            updatedAt: new Date(),
          })
          .where(eq(projects.id, project.id));
      })
    );

    return NextResponse.json({
      message: "GitHub stats updated successfully",
      updatedCount: updates.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Error updating GitHub stats:", error);
    return NextResponse.json(
      { error: "Failed to update GitHub stats" },
      { status: 500 }
    );
  }
}
