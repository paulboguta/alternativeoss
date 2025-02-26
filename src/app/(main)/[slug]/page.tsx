import { Icons } from '@/components/icons';
import { OtherCategories } from '@/components/project/other-categories';
import { ProjectAlternatives } from '@/components/project/project-alternatives';
import { ProjectCategories } from '@/components/project/project-categories';
import { ProjectContent } from '@/components/project/project-content';
import { ProjectStats } from '@/components/project/project-stats';
import {
  AlternativesSkeleton,
  CategoriesSkeleton,
  OtherCategoriesSkeleton,
  ProjectStatsSkeleton,
} from '@/components/project/skeleton-project-page';
import { Button } from '@/components/ui/button';
import {
  getOtherCategoriesWithCount,
  getProject,
  getProjectAlternatives,
  getProjectCategoriesWithCount,
  getProjectRepoStats,
  getProjects,
} from '@/data-access/project';
import { isValidProjectData } from '@/types/project';
import Link from 'next/link';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map(project => ({
    slug: project.slug,
  }));
}

async function LeftSidebar({ id }: { id: number }) {
  const [projectCategories, otherCategories, projectAlternatives] = await Promise.all([
    getProjectCategoriesWithCount(id),
    getOtherCategoriesWithCount(id),
    getProjectAlternatives(id),
  ]);

  return (
    <aside className="border-dashed px-0 md:border-r md:px-8 md:py-8">
      <div className="space-y-6 md:sticky md:top-24">
        <ProjectAlternatives alternatives={projectAlternatives} />
        <ProjectCategories categories={projectCategories} />
        <OtherCategories categories={otherCategories} />
      </div>
    </aside>
  );
}

async function RightSidebar({ projectId }: { projectId: number }) {
  const repoStats = await getProjectRepoStats(projectId);

  if (!repoStats || !repoStats.repoStars || !repoStats.repoForks || !repoStats.repoLastCommit) {
    return null;
  }

  const { repoUrl, repoStars, repoForks, repoLastCommit, license } = repoStats;

  return (
    <aside className="hidden px-8 py-8 lg:block">
      <div className="sticky top-24 space-y-4">
        <ProjectStats
          stars={repoStars}
          forks={repoForks}
          lastCommit={repoLastCommit}
          license={license}
        />
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link href={repoUrl || ''} target="_blank" rel="noopener noreferrer">
            <Icons.gitHub />
            View Repository
          </Link>
        </Button>
      </div>
    </aside>
  );
}

export default async function ProjectPage(props: { params: Params }) {
  const { slug } = await props.params;
  const projectData = await getProject(slug);

  if (!projectData || !isValidProjectData(projectData)) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 gap-8 pr-8 md:grid-cols-[300px_auto] lg:grid-cols-[300px_auto_300px] lg:pr-0">
        <Suspense
          fallback={
            <aside className="border-dashed px-0 md:border-r md:px-8 md:py-8">
              <div className="space-y-6 md:sticky md:top-24">
                <AlternativesSkeleton />
                <CategoriesSkeleton />
                <OtherCategoriesSkeleton />
              </div>
            </aside>
          }
        >
          <LeftSidebar id={projectData.id} />
        </Suspense>

        <main className="w-full min-w-0 py-8">
          <ProjectContent project={projectData} />
        </main>

        <Suspense fallback={<ProjectStatsSkeleton />}>
          <RightSidebar projectId={projectData.id} />
        </Suspense>
      </div>
    </div>
  );
}
