import { getProjectsByAlternative } from '@/data-access/project';
import { notFound } from 'next/navigation';
import { ProjectCard } from '../project/project-card';

export async function AlternativePageContent({ slug }: { slug: string }) {
  const { projects } = await getProjectsByAlternative(slug);

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
          url={project.url!}
          repoStars={project.repoStars!}
          license={project.license.name}
          repoLastCommit={project.repoLastCommit!}
        />
      ))}
    </div>
  );
}
