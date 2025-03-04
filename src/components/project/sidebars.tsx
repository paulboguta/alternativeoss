import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AD_PLACEMENT } from '@/config/ads';
import { getProject, getProjectSidebarData } from '@/data-access/project';
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';
import { AdSpot1 } from '../ads/ad-spot-1';
import { OtherCategories } from './other-categories';
import { ProjectAlternatives } from './project-alternatives';
import { ProjectCategories } from './project-categories';
import { ProjectStats } from './project-stats';

export async function RightSidebar({ slug }: { slug: string }) {
  if (!slug) {
    return null;
  }

  const project = await getProject(slug);

  if (!project) {
    return null;
  }

  return (
    <aside className="hidden space-y-4 px-4 py-8 lg:block">
      <div className="space-y-6 pb-8 md:sticky md:top-24">
        <ProjectStats
          stars={project.repoStars ?? 0}
          forks={project.repoForks ?? 0}
          lastCommit={project.repoLastCommit ?? new Date()}
          license={project.license}
        />
        <Button variant="outline" size="lg" className="w-full" asChild>
          <a href={project.repoUrl || ''} target="_blank" rel="noopener noreferrer">
            <Icons.gitHub />
            View Repository
          </a>
        </Button>
        <AdSpot1
          adMetadata={{
            placement: 'sidebar',
            adName: AD_PLACEMENT.name,
            adVersion: AD_PLACEMENT.version,
          }}
        />
      </div>
    </aside>
  );
}

export async function LeftSidebar({ projectId }: { projectId: number }) {
  'use cache';
  cacheTag(`project/${projectId}`);
  cacheLife('max'); // we revalidate it when updating

  const sidebarData = await getProjectSidebarData(projectId);

  return (
    <aside className="order-last border-dashed px-8 pt-4 pb-0 md:order-first md:border-r md:pt-0">
      <div className="space-y-6 pb-8 md:sticky md:top-24">
        <ProjectAlternatives alternatives={sidebarData.projectAlternatives} />
        <ProjectCategories categories={sidebarData.projectCategories} />
        <OtherCategories categories={sidebarData.otherCategories} />
      </div>
    </aside>
  );
}
