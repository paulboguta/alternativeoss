import { Loader2 } from 'lucide-react';

export function LoadingIndicator() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
    </div>
  );
}
