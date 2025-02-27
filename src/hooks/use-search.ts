import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

type UseSearchOptions = {
  /**
   * The delay in milliseconds for debouncing search input
   * @default 300
   */
  debounceDelay?: number;

  /**
   * The query parameter name to use for the search term
   * @default 'q'
   */
  queryParamName?: string;
};

/**
 * A hook that handles search functionality with URL search params
 * @param options Configuration options for the search
 * @returns An object with search state and handlers
 */
export function useSearch(options: UseSearchOptions = {}) {
  const { debounceDelay = 300, queryParamName = 'q' } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get the initial search term from URL
  const initialSearchTerm = searchParams.get(queryParamName) || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Debounce the search term to avoid too many URL updates
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  const updateSearchParams = useCallback(
    (term: string) => {
      // If the term is the same as what's already in the URL, don't update
      const currentTerm = searchParams.get(queryParamName) || '';
      if (term === currentTerm) return;

      const params = new URLSearchParams(searchParams);

      if (term) {
        params.set(queryParamName, term);
      } else {
        params.delete(queryParamName);
      }

      // Only reset to page 1 when the search term actually changes
      if (term !== currentTerm) {
        // If we're on page 1 or no page is specified, don't add the page parameter
        if (params.get('page') === '1') {
          params.delete('page');
        } else {
          params.set('page', '1');
        }
      }

      // Clean up URL by removing default sort parameters
      if (params.get('sort') === 'createdAt' && params.get('dir') === 'desc') {
        params.delete('sort');
        params.delete('dir');
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, queryParamName, router, searchParams, startTransition]
  );

  // Handle search input change
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isPending,
    handleSearchChange,
    updateSearchParams,
  };
}
