import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

/**
 * A hook that handles search functionality with URL search params
 * @param options Configuration options for the search
 * @returns An object with search state and handlers
 */
export function useSearch() {
  const [isPending, startTransition] = useTransition();

  const [, setSearchTerm] = useQueryState('q', {
    startTransition,
    shallow: false,
    clearOnDefault: true,
    defaultValue: '',
    throttleMs: 400,
  });

  return {
    isPending,
    setSearchTerm,
  };
}
