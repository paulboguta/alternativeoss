import { Skeleton } from '../ui/skeleton';

export function ToolbarSkeleton() {
  return (
    <div className="mb-6 flex w-full justify-end">
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
