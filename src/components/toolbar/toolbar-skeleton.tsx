import { cn } from '@/lib/utils';

export function ToolbarSkeleton() {
  return (
    <div className="mb-6 flex w-full flex-col items-start justify-start gap-4 border-y border-dashed px-8 py-4 sm:flex-row sm:items-center">
      {/* Search skeleton */}
      <div className="relative w-full sm:max-w-sm">
        <div className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4">
          <div className="bg-muted/30 h-4 w-4 animate-pulse rounded-full" />
        </div>
        <div
          className={cn(
            'border-input bg-background h-9 w-full rounded-lg border px-3 py-1 pl-8 shadow-xs'
          )}
        >
          <div className="bg-muted/20 h-full w-full animate-pulse rounded" />
        </div>
      </div>

      {/* Sorting skeleton */}
      <div className="flex items-center">
        <div
          className={cn(
            'border-input bg-background flex h-9 items-center gap-2 rounded-md border px-3 shadow-sm'
          )}
        >
          <div className="bg-muted/30 h-3.5 w-3.5 animate-pulse rounded-full" />
          <div className="bg-muted/30 h-4 w-11 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}
