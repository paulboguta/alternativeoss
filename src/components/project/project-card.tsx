import { Icons } from '@/components/icons';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Separator } from '@/components/ui/separator';
import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { format } from 'date-fns';
import Link from 'next/link';

type ProjectCardProps = {
  slug: string;
  name: string;
  summary: string;
  repoStars: number;
  license?: string | null;
  repoLastCommit: Date;
  faviconUrl?: string | null;
};

export function ProjectCard({
  slug,
  name,
  summary,
  repoStars,
  license,
  repoLastCommit,
  faviconUrl,
}: ProjectCardProps) {
  return (
    <Link href={`/${slug}`} className="block" prefetch={false}>
      <div className="border-border/50 bg-card hover:bg-muted/10 hover:border-ring/20 ring-ring/8 relative flex h-full flex-col rounded-lg border p-6 shadow-xs transition-all hover:ring-[3px]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 leading-none font-semibold tracking-tight">
              <OptimizedImage
                src={faviconUrl || SVG_PLACEHOLDER}
                alt={`${name} favicon`}
                width={20}
                height={20}
                className="rounded-sm"
                isIcon
              />
              <span className="text-foreground">{name}</span>
            </h3>
            <p className="text-muted-foreground line-clamp-3 min-h-[60px] text-sm">{summary}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Icons.gitHub className="h-4 w-4" />
            <span>{repoStars.toLocaleString()} stars</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span className="text-[13px]">Last commit {format(repoLastCommit, 'MMM d, yyyy')}</span>
            {license && license !== 'other' && license !== 'unknown' && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <span className="uppercase">{license}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
