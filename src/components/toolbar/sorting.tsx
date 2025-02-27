'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortDirection, SortField } from '@/config/sorting';
import { useSorting } from '@/hooks/use-sorting';
import { SortDesc } from 'lucide-react';
import { LoadingIndicator } from '../loading-indicator';

type SortingProps = {
  defaultSort?: {
    field: SortField;
    direction: SortDirection;
  };
};

export function Sorting({ defaultSort }: SortingProps) {
  const { open, setOpen, isLoading, currentSortOption, handleSortChange, sortOptions } = useSorting(
    { defaultSort }
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 md:gap-2">
          {isLoading ? <LoadingIndicator /> : <SortDesc className="h-3.5 w-3.5" />}
          <span className="font-medium">{currentSortOption?.label || 'Newest'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {sortOptions.map(option => {
          return (
            <DropdownMenuItem
              key={`${option.field}-${option.direction}`}
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleSortChange(option)}
            >
              <div className="flex items-center">
                {option.icon}
                {option.label}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
