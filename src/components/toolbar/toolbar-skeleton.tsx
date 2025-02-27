import { Skeleton } from '../ui/skeleton';

export function ToolbarSkeleton() {
  return (
    <div className="mb-6 flex w-full flex-col items-start justify-start gap-4 border-y border-dashed px-8 py-4 sm:flex-row sm:items-center">
      {/* Search skeleton */}
      <div className="relative w-full sm:max-w-sm">
        <div className="absolute top-2.5 left-2.5 h-4 w-4">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full pl-8" />
      </div>

      {/* Sorting skeleton */}
      <div className="flex items-center">
        <div className="flex h-9 items-center gap-2 rounded-md border px-3">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
