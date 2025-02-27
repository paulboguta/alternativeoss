import { SortField } from '@/config/sorting';

import { SortDirection } from '@/config/sorting';
import { SearchParams } from 'nuqs/server';
import { Search } from './search';
import { Sorting } from './sorting';

export async function Toolbar({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const awaitedParams = await searchParams;
  const { sort, dir } = awaitedParams;

  const defaultSort = {
    field: sort ? (sort as SortField) : 'createdAt',
    direction: dir ? (dir as SortDirection) : 'desc',
  };

  return (
    <div className="mb-6 flex w-full flex-col items-start justify-start gap-4 border-y border-dashed px-8 py-4 sm:flex-row sm:items-center">
      <Search />
      <Sorting defaultSort={defaultSort} />
    </div>
  );
}
