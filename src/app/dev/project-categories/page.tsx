import { ProjectCategoriesPageClient } from '@/components/dev/project-categories/project-categories-page-client';
import { db } from '@/db';
import { categories, projectCategories, projects } from '@/db/schema';
import { enhanceProjectsWithFavicons } from '@/utils/data-table-helpers';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';

async function ProjectCategoriesContent() {
  // Get all projects and enhance with favicons
  const allProjects = await db.select().from(projects);
  const enhancedProjects = enhanceProjectsWithFavicons(allProjects);

  // Get all categories
  const allCategories = await db.select().from(categories);

  // Get all connections with related data
  const connections = await Promise.all(
    enhancedProjects.map(async project => {
      const projectCategoriesData = await db
        .select({
          categoryId: projectCategories.categoryId,
        })
        .from(projectCategories)
        .where(eq(projectCategories.projectId, project.id));

      const connectedCategoriesWithUndefined = await Promise.all(
        projectCategoriesData.map(async pc => {
          const category = await db
            .select()
            .from(categories)
            .where(eq(categories.id, pc.categoryId))
            .limit(1);

          return category[0];
        })
      );

      // Filter out any undefined values
      const connectedCategories = connectedCategoriesWithUndefined.filter(
        (cat): cat is (typeof allCategories)[0] => cat !== undefined
      );

      return {
        project,
        categories: connectedCategories,
      };
    })
  );

  return (
    <ProjectCategoriesPageClient
      projects={enhancedProjects}
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
