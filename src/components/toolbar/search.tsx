'use client';

import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/use-search';

import debounce from 'debounce';
import { Search as SearchIcon } from 'lucide-react';
import { LoadingIndicator } from '../loading-indicator';

export function Search() {
  const { isPending, setSearchTerm } = useSearch();

  const debouncedSetSearchTerm = debounce(setSearchTerm, 350);

  return (
    <div className="relative w-full sm:max-w-sm">
      {isPending ? (
        <div className="absolute top-2.5 left-2.5 h-4 w-4">
          <LoadingIndicator />
        </div>
      ) : (
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      )}
      <Input
        type="search"
        placeholder="Search projects..."
        className="w-full pr-4 pl-8"
        onChange={e => debouncedSetSearchTerm(e.target.value)}
        aria-label="Search projects"
      />
    </div>
  );
}
