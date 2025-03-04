import { getProjectsUseCase } from '@/use-cases/project';

import { ITEMS_PER_PAGE, loadSearchParams } from '@/lib/search-params';

import { AD_PLACEMENT } from '@/config/ads';
import { DEFAULT_SORT_PROJECTS } from '@/config/sorting';
import { SearchParams } from 'nuqs/server';
import { AdSpot2 } from '../ads/ad-spot-2';
import { Pagination } from '../pagination';
import { ProjectCard } from './project-card';

export async function ProjectsContent({ searchParams }: { searchParams: SearchParams }) {
  const { q, sort, dir, page } = await loadSearchParams(searchParams);

  const currentPage = page ? Number(page) : 1;

  const result = await getProjectsUseCase({
    searchQuery: q as string,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField: sort ?? DEFAULT_SORT_PROJECTS.field,
    sortDirection: dir ?? DEFAULT_SORT_PROJECTS.direction,
  });

  const { projects: paginatedProjects, pagination } = result;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdSpot2
          adMetadata={{
            placement: 'projects',
            adName: AD_PLACEMENT.name,
            adVersion: AD_PLACEMENT.version,
          }}
        />

        {paginatedProjects.length > 0 ? (
          paginatedProjects.map(project => (
            <ProjectCard
              key={project.name}
              name={project.name}
              summary={project.summary!}
              slug={project.slug}
              repoStars={project.repoStars!}
              license={project.license?.name}
              repoLastCommit={project.repoLastCommit!}
              faviconUrl={project.faviconUrl}
            />
          ))
        ) : (
          <div className="col-span-2 py-8 text-center">
            <h3 className="text-muted-foreground text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination {...pagination} />
        </div>
      )}
    </>
  );
}
