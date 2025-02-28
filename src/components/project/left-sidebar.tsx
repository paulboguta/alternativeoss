import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { getProject } from '@/data-access/project';
import Link from 'next/link';
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
    <aside className="hidden space-y-4 px-8 py-8 lg:block">
      <ProjectStats
        stars={project.repoStars ?? 0}
        forks={project.repoForks ?? 0}
        lastCommit={project.repoLastCommit ?? new Date()}
        license={project.license}
      />
      <Button variant="outline" size="lg" className="w-full" asChild>
        <Link href={project.repoUrl || ''} target="_blank" rel="noopener noreferrer">
          <Icons.gitHub />
          View Repository
        </Link>
      </Button>
    </aside>
  );
}
