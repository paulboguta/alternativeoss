import { Separator } from '@radix-ui/react-separator';
import { Skeleton } from '../ui/skeleton';

function SkeletonProjectCard() {
  return (
    <div className="border-border/50 bg-card relative flex h-full flex-col rounded-lg border p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 leading-none">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="min-h-[60px]">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Separator orientation="vertical" className="h-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// Used on the main paginated page
export function SkeletonProjectsContent() {
  const skeletonCards = Array.from({ length: 9 }, (_, i) => i);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map(index => (
          <SkeletonProjectCard key={index} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {/* Skeleton for pagination */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex h-8 w-8 items-center justify-center">
              <div className="bg-muted h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
