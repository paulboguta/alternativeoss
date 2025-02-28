import { getProjectsUseCase } from '@/use-cases/project';

import { ITEMS_PER_PAGE } from '@/lib/search-params';

import { SortDirection } from '@/config/sorting';

import { SortField } from '@/config/sorting';
import { SearchParams } from 'nuqs/server';
import { Pagination } from '../pagination';
import { ProjectCard } from './project-card';

export async function ProjectsContent({ searchParams }: { searchParams: SearchParams }) {
  const { page, sort, dir, q } = searchParams;

  const sortField = sort ? (sort as SortField) : undefined;
  const sortDirection = dir ? (dir as SortDirection) : undefined;

  const currentPage = page ? Number(page) : 1;

  const result = await getProjectsUseCase({
    searchQuery: q as string,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField,
    sortDirection,
  });

  const { projects: paginatedProjects, pagination } = result;

  const createUrl = (newPage: number) => {
    const params = new URLSearchParams();

    // Only add page parameter if it's not page 1
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }

    // Only add sort parameters if they're not the defaults
    if (sortField && sortField !== 'createdAt') {
      params.set('sort', sortField);
    }

    if (sortDirection && sortDirection !== 'desc') {
      params.set('dir', sortDirection);
    }

    if (q) {
      params.set('q', q as string);
    }

    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="col-span-3 py-8 text-center">
            <h3 className="text-muted-foreground text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">
              {q
                ? `No projects match your search for "${q}"`
                : 'No projects available at this time'}
            </p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            createUrl={createUrl}
          />
        </div>
      )}
    </>
  );
}
