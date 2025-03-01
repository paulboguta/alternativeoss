import { AlternativeCard } from '@/components/alternative/alternative-card';
import { AlternativesHeader } from '@/components/alternative/alternatives-header';
import { Pagination } from '@/components/pagination';
import { Toolbar } from '@/components/toolbar/toolbar';
import { ToolbarSkeleton } from '@/components/toolbar/toolbar-skeleton';
import { ALTERNATIVES_SORT_OPTIONS, DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';

import { ITEMS_PER_PAGE, loadSearchParams } from '@/lib/search-params';
import { AlternativeSortField } from '@/types/sorting';
import { getAlternativesUseCase } from '@/use-cases/alternative';

import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export async function AlternativesContent({ searchParams }: { searchParams: SearchParams }) {
  const { q, sort, dir, page } = await loadSearchParams(searchParams);

  const currentPage = page ? Number(page) : 1;

  const { alternatives, pagination } = await getAlternativesUseCase({
    searchQuery: q,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField: sort ?? DEFAULT_SORT_ALTERNATIVES.field,
    sortDirection: dir ?? DEFAULT_SORT_ALTERNATIVES.direction,
  });

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alternatives.length > 0 ? (
          alternatives.map(alternative => (
            <AlternativeCard
              key={alternative.id}
              name={alternative.name}
              slug={alternative.slug}
              faviconUrl={alternative.faviconUrl}
              summary={alternative.summary ?? 'This is a mock tagline'}
              count={alternative.projectCount}
              projectFaviconUrls={alternative.projectFaviconUrls}
            />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center">
            <h3 className="text-muted-foreground text-lg font-medium">No alternatives found</h3>
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
          <Pagination totalPages={pagination.totalPages} />
        </div>
      )}
    </>
  );
}

export default async function AlternativesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const awaitedSearchParams = await searchParams;

  return (
    <div>
      <AlternativesHeader />

      <Suspense fallback={<ToolbarSkeleton />}>
        <Toolbar<AlternativeSortField>
          defaultSort={DEFAULT_SORT_ALTERNATIVES}
          sortOptions={ALTERNATIVES_SORT_OPTIONS}
          searchPlaceholder="Search alternatives..."
        />
      </Suspense>

      <section className="px-8 pb-24">
        <Suspense fallback={<div>loading ...</div>}>
          <AlternativesContent searchParams={awaitedSearchParams} />
        </Suspense>
      </section>
    </div>
  );
}
