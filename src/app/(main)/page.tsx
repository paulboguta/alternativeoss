import { EmailCapture } from '@/components/email/email-capture';
import { Pagination } from '@/components/pagination';
import { ProjectCard } from '@/components/project/project-card';
import { SkeletonProjectsContent } from '@/components/project/skeleton-projects';
import { getPaginatedProjects } from '@/data-access/project';
import { ITEMS_PER_PAGE, searchParams } from '@/lib/search-params';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';


  

async function ProjectsContent({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const awaitedParams = await rawSearchParams;

  const { page } = awaitedParams;
  const currentPage = page ? searchParams.page.parseServerSide(page) : 1;

  const { projects: paginatedProjects, pagination } = await getPaginatedProjects(
    currentPage,
    ITEMS_PER_PAGE
  );

  const createUrl = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    return `/?${params.toString()}`;
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProjects.map(project => (
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

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          createUrl={createUrl}
        />
      </div>
    </>
  );
}

export default function HomePage(props: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
          Discover Open Source Software
        </h1>
        <EmailCapture />
      </section>

      <section className="pb-24">
        <Suspense fallback={<SkeletonProjectsContent />}>
          <ProjectsContent searchParams={props.searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
