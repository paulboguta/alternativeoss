import { ProjectAlternativesPageClient } from '@/components/dev/project-alternatives/project-alternatives-page-client';
import { db } from '@/db';
import { alternatives, projectAlternatives, projects } from '@/db/schema';

import Link from 'next/link';
import { Suspense } from 'react';

async function ProjectAlternativesContent() {
  const allProjects = await db.select().from(projects);

  const allAlternatives = await db.select().from(alternatives);

  const allConnections = await db
    .select({
      projectId: projectAlternatives.projectId,
      alternativeId: projectAlternatives.alternativeId,
    })
    .from(projectAlternatives);

  // Create a map of alternative IDs to alternative objects for quick lookup
  const alternativesMap = new Map(
    allAlternatives.map(alternative => [alternative.id, alternative])
  );

  const connections = allProjects.map(project => {
    const projectConnections = allConnections.filter(
      connection => connection.projectId === project.id
    );

    const connectedAlternatives = projectConnections
      .map(connection => alternativesMap.get(connection.alternativeId))
      .filter((alt): alt is (typeof allAlternatives)[0] => alt !== undefined);

    return {
      project,
      alternatives: connectedAlternatives,
    };
  });

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
