import { Project } from '@/db/types';
import { License } from '@/types/license';
import { ProjectCard } from '../project/project-card';

type ProjectWithLicense = Project & {
  license: License;
};

export async function AlternativePageContent({ projects }: { projects: ProjectWithLicense[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard
          key={project.name}
          name={project.name}
          summary={project.summary!}
          url={project.url!}
          repoStars={project.repoStars!}
          license={project.license?.name ?? ''}
          repoLastCommit={project.repoLastCommit!}
        />
      ))}
    </div>
  );
}
