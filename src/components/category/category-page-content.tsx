import { ProjectCard } from '@/components/project/project-card';
import { Project } from '@/db/types';
import { License } from '@/types/license';
import { notFound } from 'next/navigation';

type ProjectWithLicense = Project & {
  license: License;
};

type CategoryPageContentProps = {
  projects: ProjectWithLicense[];
};

export async function CategoryPageContent({ projects }: CategoryPageContentProps) {
  if (!projects) {
    notFound();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard
          key={project.name}
          name={project.name}
          summary={project.summary!}
          slug={project.slug}
          faviconUrl={project.faviconUrl!}
          repoStars={project.repoStars!}
          license={project.license?.name ?? ''}
          repoLastCommit={project.repoLastCommit!}
        />
      ))}
    </div>
  );
}
