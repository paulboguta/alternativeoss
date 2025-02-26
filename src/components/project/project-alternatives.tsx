import { OptimizedImage } from '@/components/ui/optimized-image';
import { getFaviconUrl } from '@/lib/favicon';
import { generateSlug } from '@/utils/slug';
import Link from 'next/link';

type Alternative = {
  alternatives: {
    id: number;
    name: string;
    url: string | null;
  };
  project_alternatives?: {
    projectId: number;
    alternativeId: number;
  };
};

type ProjectAlternativesProps = {
  alternatives: Alternative[];
};

export function ProjectAlternatives({ alternatives }: ProjectAlternativesProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-bg/60 text-sm font-medium">Alternative to</h2>
      <div className="flex w-full flex-wrap gap-x-1">
        {alternatives.map(alt => (
          <Link
            key={alt.alternatives.id}
            href={`/alternatives/${generateSlug(alt.alternatives.name)}`}
            className="group hover:bg-accent/50 flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors"
          >
            <div className="flex items-center justify-center rounded-md">
              <OptimizedImage
                src={getFaviconUrl(alt.alternatives.url || '')}
                alt={`${alt.alternatives.name} favicon`}
                width={12}
                height={12}
                className="rounded-sm"
                isIcon
              />
            </div>
            <span className="group-hover:text-foreground text-muted-foreground text-xs font-medium">
              {alt.alternatives.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
