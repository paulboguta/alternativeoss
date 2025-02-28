'use client';

import { SortDirection, SortField, SortOption, sortOptions } from '@/config/sorting';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useState, useTransition } from 'react';

type UseSortingProps = {
  defaultSort?: {
    field: SortField;
    direction: SortDirection;
  };
};

export function useSorting({ defaultSort }: UseSortingProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [sort, setSort] = useQueryState('sort', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: 'createdAt',
    throttleMs: 200,
  });

  const [dir, setDir] = useQueryState('dir', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: 'desc',
    throttleMs: 200,
  });

  const currentSortField = defaultSort?.field || searchParams.get('sort') || 'createdAt';
  const currentSortDirection = defaultSort?.direction || searchParams.get('dir') || 'desc';

  const handleSortChange = (option: SortOption) => {
    // If the selected option is already active, just close the dropdown
    if (option.field === currentSortField && option.direction === currentSortDirection) {
      setOpen(false);
      return;
    }

    setSort(option.field);
    setDir(option.direction);

    setOpen(false);
  };

  return {
    open,
    setOpen,
    isPending,
    sort,
    dir,
    handleSortChange,
    sortOptions,
  };
}
