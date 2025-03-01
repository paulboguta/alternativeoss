'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useSorting } from '@/hooks/use-sorting';
import { SortOption } from '@/types/sorting';
import { SortDesc } from 'lucide-react';
import { LoadingIndicator } from '../loading-indicator';

type SortingProps<T extends string> = {
  defaultSort: SortOption<T>;
  sortOptions: SortOption<T>[];
};

export function Sorting<T extends string>({ defaultSort, sortOptions }: SortingProps<T>) {
  const { open, setOpen, isPending, sort, handleSortChange } = useSorting<T>({
    defaultSort,
  });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 md:gap-2">
          {isPending ? <LoadingIndicator /> : <SortDesc className="h-3.5 w-3.5" />}
          <span className="font-medium">
            {sortOptions.find(option => option.field === sort)?.label || defaultSort.label}
          </span>
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
