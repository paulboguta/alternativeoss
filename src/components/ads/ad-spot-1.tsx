import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { AdMetadata } from '@/types/analytics';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { OptimizedImage } from '../ui/optimized-image';
import { ClickAdButton } from './analytics';

type AdData = {
  url?: string;
  name?: string;
  summary?: string;
  faviconUrl?: string;
};

export function AdSpot1({
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
    return <AdSpot1Placement adMetadata={adMetadata} />;
  } else {
    return <AdSpot1Content ad={{ url, name, summary, faviconUrl }} adMetadata={adMetadata} />;
  }
}

function AdSpot1Content({ ad, adMetadata }: { ad: AdData; adMetadata?: AdMetadata }) {
  const content = (
    <a href={ad.url} target="_blank" rel="noopener noreferrer">
      <div className="border-border/50 bg-muted/50 hover:bg-muted/60 hover:border-ring/20 ring-ring/10 relative flex h-fit flex-col space-y-3 rounded-lg border p-4 shadow-sm transition-all hover:ring-[3px]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 leading-none font-semibold tracking-tight">
              <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-500/10 p-1">
                <OptimizedImage
                  src={ad.faviconUrl || SVG_PLACEHOLDER}
                  alt={`${ad.name} favicon`}
                  width={24}
                  height={24}
                  className="rounded-sm"
                  isIcon
                />
              </div>
              <span className="text-foreground">{ad.name}</span>
            </h3>
            <p className="text-muted-foreground min-h-[60px] text-sm">{ad.summary}</p>
          </div>
        </div>
        <Button
          className="group text-muted mt-1 cursor-pointer bg-white/90 hover:bg-white/80"
          variant="secondary"
        >
          Visit {ad.name}
          <ArrowRightIcon
            className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
            size={16}
            aria-hidden="true"
          />
        </Button>

        <Badge variant="outline" className="absolute top-3 right-3 text-xs">
          Ad
        </Badge>
      </div>
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

export function AdSpot1Placement({ adMetadata }: { adMetadata?: AdMetadata }) {
  const content = (
    <Link
      prefetch={false}
      href="/advertise"
      className="border-border/50 bg-muted/50 hover:bg-muted/60 hover:border-ring/20 ring-ring/10 relative flex h-fit flex-col space-y-3 rounded-lg border p-4 shadow-sm transition-all hover:ring-[3px]"
    >
      <div className="w-full space-y-3">
        <h3 className="text-foreground text-lg font-semibold tracking-tight">Ad spot</h3>

        <p className="text-muted-foreground text-sm">
          Reach a growing audience of tech enthusiasts, developers and founders.
        </p>
      </div>
      <Button
        className="group text-muted mt-1 cursor-pointer bg-white/90 hover:bg-white/80"
        variant="secondary"
        aria-label="Learn more about advertising opportunities"
      >
        Advertising
        <ArrowRightIcon
          className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
          size={16}
          aria-hidden="true"
        />
      </Button>

      <Badge variant="outline" className="absolute top-3 right-3 text-xs">
        Ad
      </Badge>
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
