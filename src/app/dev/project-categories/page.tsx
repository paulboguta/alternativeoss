import { ProjectCategoriesPageClient } from '@/components/dev/project-categories/project-categories-page-client';
import { db } from '@/db';
import { categories, projectCategories, projects } from '@/db/schema';

import { asc } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';

async function ProjectCategoriesContent() {
  const allProjects = await db.select().from(projects);

  const allCategories = await db.select().from(categories).orderBy(asc(categories.name));

  const allConnections = await db
    .select({
      projectId: projectCategories.projectId,
      categoryId: projectCategories.categoryId,
    })
    .from(projectCategories);

  const categoriesMap = new Map(allCategories.map(category => [category.id, category]));

  const connections = allProjects.map(project => {
    const projectConnections = allConnections.filter(
      connection => connection.projectId === project.id
    );

    const connectedCategories = projectConnections
      .map(connection => categoriesMap.get(connection.categoryId))
      .filter((cat): cat is (typeof allCategories)[0] => cat !== undefined);

    return {
      project,
      categories: connectedCategories,
    };
  });

  return (
    <ProjectCategoriesPageClient
      projects={allProjects}
      categories={allCategories}
      connections={connections}
    />
  );
}

export default async function ProjectCategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Project Categories</h1>
        <p className="text-muted-foreground mt-2">Connect projects to their categories</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectCategoriesContent />
      </Suspense>
    </div>
  );
}
