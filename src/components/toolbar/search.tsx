'use client';

import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/use-search';
import { Search as SearchIcon } from 'lucide-react';
import { useEffect } from 'react';
import { LoadingIndicator } from '../loading-indicator';

export function Search() {
  const { searchTerm, debouncedSearchTerm, isPending, handleSearchChange, updateSearchParams } =
    useSearch({
      debounceDelay: 400,
    });

  useEffect(() => {
    updateSearchParams(debouncedSearchTerm);
  }, [debouncedSearchTerm, updateSearchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search projects..."
        className="w-full pr-4 pl-8"
        value={searchTerm}
        onChange={e => handleSearchChange(e.target.value)}
        aria-label="Search projects"
      />
      {isPending && (
        <div className="absolute top-2.5 right-2.5 h-4 w-4">
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
}
