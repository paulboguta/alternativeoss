import { SVG_PLACEHOLDER } from '@/lib/favicon';
import Link from 'next/link';
import { OptimizedImage } from '../ui/optimized-image';

export function AlternativeCard({
  name,
  slug,
  summary,
  count,
  projectFaviconUrls,
  faviconUrl,
}: {
  name: string;
  slug: string;
  summary: string | null;
  count: number;
  faviconUrl: string | null;
  projectFaviconUrls: string[] | null;
}) {
  return (
    <Link href={`/alternatives/${slug}`} className="group block" prefetch={false}>
      <div className="border-border/50 bg-card hover:bg-muted/10 hover:border-ring/20 ring-ring/8 relative flex h-full flex-col rounded-lg border p-6 shadow-xs transition-all hover:ring-[3px]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 leading-none font-semibold tracking-tight">
              <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-300/10 p-1">
                <OptimizedImage
                  src={faviconUrl || SVG_PLACEHOLDER}
                  alt={`${name} favicon`}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  isIcon
                />
              </div>
              <span className="text-foreground">{name}</span>
            </h3>
            <p className="text-muted-foreground line-clamp-2 min-h-[30px] text-sm">{summary}</p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-col gap-2">
          <span className="text-muted-foreground/70 absolute top-0 block text-sm transition-opacity duration-200 group-hover:opacity-0">
            Explore <span className="font-bold">{count}</span> open source alternatives
          </span>
          <div className="flex gap-2">
            {projectFaviconUrls?.slice(0, 9).map(url => (
              <div
                key={url}
                className="items-center justify-center rounded-md border border-zinc-800 bg-zinc-300/10 p-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <OptimizedImage
                  src={url}
                  alt={`${name} project favicon`}
                  width={16}
                  height={16}
                  className="rounded-sm"
                  isIcon
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
