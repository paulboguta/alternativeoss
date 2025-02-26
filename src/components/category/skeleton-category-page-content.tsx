import { Skeleton } from '@/components/ui/skeleton';

export function CategoryContentSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="border-border/50 bg-card relative flex h-full flex-col rounded-lg border p-6 shadow-xs"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="mb-1 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
