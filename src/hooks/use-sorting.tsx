'use client';

import { SortOption } from '@/types/sorting';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState, useTransition } from 'react';

type UseSortingProps<T extends string> = {
  defaultSort: SortOption<T>;
};

export function useSorting<T extends string>({ defaultSort }: UseSortingProps<T>) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [sort, setSort] = useQueryState('sort', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: defaultSort?.field,
    throttleMs: 200,
  });

  const [, setPage] = useQueryState('page', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: '1',
    throttleMs: 200,
  });

  const [dir, setDir] = useQueryState('dir', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: defaultSort?.direction,
    throttleMs: 200,
  });

  const currentSortField = defaultSort?.field || searchParams.get('sort');
  const currentSortDirection = defaultSort?.direction || searchParams.get('dir');

  const handleSortChange = (option: SortOption<T>) => {
    // If the selected option is already active, just close the dropdown
    if (option.field === currentSortField && option.direction === currentSortDirection) {
      setOpen(false);
      return;
    }

    setSort(option.field);
    setDir(option.direction);
    setPage('1'); // Reset page to 1 when sorting changes

    setOpen(false);
  };

  return {
    open,
    setOpen,
    isPending,
    sort,
    dir,
    handleSortChange,
  };
}
