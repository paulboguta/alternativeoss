import { AlternativesContent } from '@/components/alternative/alternatives-content';
import { AlternativesHeader } from '@/components/alternative/alternatives-header';
import { SkeletonAlternativesContent } from '@/components/alternative/skeleton-alternatives';
import { Toolbar } from '@/components/toolbar/toolbar';
import { ToolbarSkeleton } from '@/components/toolbar/toolbar-skeleton';
import { ALTERNATIVES_SORT_OPTIONS, DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';

import { AlternativeSortField } from '@/types/sorting';

import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

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
        <Suspense fallback={<SkeletonAlternativesContent />}>
          <AlternativesContent searchParams={awaitedSearchParams} />
        </Suspense>
      </section>
    </div>
  );
}
