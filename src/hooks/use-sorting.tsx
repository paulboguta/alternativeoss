'use client';

import { SortDirection, SortField, SortOption, sortOptions } from '@/config/sorting';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type UseSortingProps = {
  defaultSort?: {
    field: SortField;
    direction: SortDirection;
  };
};

export function useSorting({ defaultSort }: UseSortingProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortField = defaultSort?.field || searchParams.get('sort') || 'createdAt';
  const currentSortDirection = defaultSort?.direction || searchParams.get('dir') || 'desc';

  // Reset loading state when search params change (query completed)
  useEffect(() => {
    setIsLoading(false);
  }, [searchParams]);

  const currentSortOption = sortOptions.find(
    option => option.field === currentSortField && option.direction === currentSortDirection
  );

  const createSortUrl = (option: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    // Only set sort parameters if they're different from defaults
    if (option.field !== 'createdAt' || option.direction !== 'desc') {
      params.set('sort', option.field);
      params.set('dir', option.direction);
    } else {
      // If using default sort, remove the parameters
      params.delete('sort');
      params.delete('dir');
    }

    // Don't reset the page when sorting changes
    // This allows users to sort while on any page

    return `${pathname}?${params.toString()}`;
  };

  const handleSortChange = (option: SortOption) => {
    // If the selected option is already active, just close the dropdown
    if (option.field === currentSortField && option.direction === currentSortDirection) {
      setOpen(false);
      return;
    }

    setIsLoading(true);

    const url = createSortUrl(option);
    router.push(url);

    setOpen(false);
  };

  return {
    open,
    setOpen,
    isLoading,
    currentSortField,
    currentSortDirection,
    currentSortOption,
    handleSortChange,
    sortOptions,
  };
}
