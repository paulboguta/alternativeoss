import { DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';
import { ITEMS_PER_PAGE } from '@/lib/search-params';

import { loadSearchParams } from '@/lib/search-params';
import { getAlternativesUseCase } from '@/use-cases/alternative';
import { SearchParams } from 'nuqs/server';

import { Pagination } from '@/components/pagination';
import { AD_PLACEMENT } from '@/config/ads';
import { AdSpot2 } from '../ads/ad-spot-2';
import { AlternativeCard } from './alternative-card';

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
        <AdSpot2
          adMetadata={{
            placement: 'alternatives',
            adName: AD_PLACEMENT.name,
            adVersion: AD_PLACEMENT.version,
          }}
        />

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
