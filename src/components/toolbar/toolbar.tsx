import { SortField } from '@/config/sorting';

import { SortDirection } from '@/config/sorting';
import { SearchParams } from 'nuqs/server';
import { Sorting } from './sorting';

export async function Toolbar({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const awaitedParams = await searchParams;
  const { sort, dir } = awaitedParams;

  const defaultSort = {
    field: sort ? (sort as SortField) : 'createdAt',
    direction: dir ? (dir as SortDirection) : 'desc',
  };

  return (
    <div className="mb-6 flex w-full justify-end">
      <Sorting defaultSort={defaultSort} />
    </div>
  );
}
