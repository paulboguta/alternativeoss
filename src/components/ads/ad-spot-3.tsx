import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { cn } from '@/lib/utils';
import { AdMetadata } from '@/types/analytics';
import Link from 'next/link';
import { OptimizedImage } from '../ui/optimized-image';
import { ClickAdButton } from './analytics';

type AdData = {
  url?: string;
  name?: string;
  summary?: string;
  faviconUrl?: string;
};

export function AdSpot3({
  url,
  name,
  summary,
  faviconUrl,
  adMetadata,
}: {
  url?: string;
  name?: string;
  summary?: string;
  faviconUrl?: string;
  adMetadata?: AdMetadata;
}) {
  if (!url && !name && !summary && !faviconUrl) {
    return <AdSpot3Placement adMetadata={adMetadata} />;
  } else {
    return <AdSpot3Content ad={{ url, name, summary, faviconUrl }} adMetadata={adMetadata} />;
  }
}

function AdSpot3Content({
  ad,
  className,
  adMetadata,
}: {
  ad: AdData;
  className?: string;
  adMetadata?: AdMetadata;
}) {
  const content = (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group border-border/50 bg-muted/30 hover:bg-muted/40 relative flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 transition-colors',
        className
      )}
    >
      <div className="relative flex h-4 w-4 items-center justify-center rounded-sm">
        <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-zinc-500/10">
          <OptimizedImage
            src={ad.faviconUrl || SVG_PLACEHOLDER}
            alt={`${ad.name} favicon`}
            width={16}
            height={16}
            className="rounded-sm"
            isIcon
          />
        </div>
      </div>
      <span className="text-muted-foreground text-xs font-medium">{ad.name}</span>
    </a>
  );

  if (adMetadata) {
    return (
      <ClickAdButton eventType="click-ad" eventPayload={adMetadata}>
        {content}
      </ClickAdButton>
    );
  }

  return content;
}

export function AdSpot3Placement({
  className,
  adMetadata,
}: {
  className?: string;
  adMetadata?: AdMetadata;
}) {
  const content = (
    <Link
      prefetch={false}
      href="/advertise"
      className={cn(
        'group border-border/50 bg-muted/30 hover:bg-muted/40 relative flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 transition-colors',
        className
      )}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-zinc-500/10">
        <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400/70"></div>
      </div>
      <span className="text-muted-foreground text-xs font-medium">Sponsor spot</span>
    </Link>
  );

  if (adMetadata) {
    return (
      <ClickAdButton eventType="visit-advertising" eventPayload={adMetadata}>
        {content}
      </ClickAdButton>
    );
  }

  return content;
}
