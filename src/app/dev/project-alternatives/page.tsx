import { ProjectAlternativesPageClient } from '@/components/dev/project-alternatives/project-alternatives-page-client';
import { db } from '@/db';
import { alternatives, projectAlternatives, projects } from '@/db/schema';

import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';

async function ProjectAlternativesContent() {
  // Get all projects and enhance with favicons
  const allProjects = await db.select().from(projects);

  // Get all alternatives and enhance with favicons
  const allAlternatives = await db.select().from(alternatives);

  // Get all connections with related data
  const connections = await Promise.all(
    allProjects.map(async project => {
      const projectAlternativesData = await db
        .select({
          alternativeId: projectAlternatives.alternativeId,
        })
        .from(projectAlternatives)
        .where(eq(projectAlternatives.projectId, project.id));

      const connectedAlternativesWithUndefined = await Promise.all(
        projectAlternativesData.map(async pa => {
          const alternative = await db
            .select()
            .from(alternatives)
            .where(eq(alternatives.id, pa.alternativeId))
            .limit(1);

          return alternative[0];
        })
      );

      // Filter out any undefined values
      const connectedAlternatives = connectedAlternativesWithUndefined.filter(
        (alt): alt is (typeof allAlternatives)[0] => alt !== undefined
      );

      return {
        project,
        alternatives: connectedAlternatives,
      };
    })
  );

  return (
    <ProjectAlternativesPageClient
      projects={allProjects}
      alternatives={allAlternatives}
      connections={connections}
    />
  );
}

export default async function ProjectAlternativesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Project Alternatives</h1>
        <p className="text-muted-foreground mt-2">Connect projects to their alternatives</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectAlternativesContent />
      </Suspense>
    </div>
  );
}
