import { Skeleton } from '@/components/ui/skeleton';

function AlternativesSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-wrap gap-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-md" />
          ))}
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-wrap gap-1.5">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-md" />
          ))}
      </div>
    </div>
  );
}

function OtherCategoriesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <div className="flex flex-col gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
      </div>
    </div>
  );
}

function ProjectStatsSkeleton() {
  return (
    <aside className="hidden space-y-4 px-8 py-8 lg:block">
      <div className="bg-card/50 h-fit rounded-lg border px-6 py-4">
        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
        </div>
      </div>
    </aside>
  );
}

export { AlternativesSkeleton, CategoriesSkeleton, OtherCategoriesSkeleton, ProjectStatsSkeleton };
