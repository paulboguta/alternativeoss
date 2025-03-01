import { Skeleton } from '@/components/ui/skeleton';

function SkeletonAlternativeCard() {
  return (
    <div className="border-border/50 bg-card relative flex h-full flex-col rounded-lg border p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 leading-none">
            <div className="bg-zinc-300/05 flex items-center justify-center rounded-lg border border-zinc-800/50 p-1">
              <Skeleton className="h-5 w-5 rounded-sm" />
            </div>
            <Skeleton className="h-5 w-32" />
          </h3>
          <div className="text-muted-foreground line-clamp-3 min-h-[30px] text-sm">
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="mb-2 h-3 w-full" />
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex flex-col gap-2">
        <span className="text-muted-foreground/70 block text-sm">
          <Skeleton className="h-4 w-56" />
        </span>
      </div>
    </div>
  );
}

// Used on the main paginated page
export function SkeletonAlternativesContent() {
  const skeletonCards = Array.from({ length: 9 }, (_, i) => i);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map(index => (
          <SkeletonAlternativeCard key={index} />
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
