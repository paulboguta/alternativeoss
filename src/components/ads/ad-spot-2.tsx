import { env } from '@/env';
import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { AdMetadata } from '@/types/analytics';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { OptimizedImage } from '../ui/optimized-image';
import { ClickAdButton } from './analytics';

type AdData = {
  url?: string;
  name?: string;
  summary?: string;
  faviconUrl?: string;
};

export function AdSpot2({
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
    return <AdSpot2Placement adMetadata={adMetadata} />;
  } else {
    return <AdSpot2Content ad={{ url, name, summary, faviconUrl }} adMetadata={adMetadata} />;
  }
}

function AdSpot2Content({ ad, adMetadata }: { ad: AdData; adMetadata?: AdMetadata }) {
  const content = (
    <a href={ad.url} target="_blank" rel="noopener noreferrer">
      <div className="border-border/50 bg-muted/50 hover:bg-muted/60 hover:border-ring/20 ring-ring/10 relative flex h-full flex-col rounded-lg border p-6 shadow-sm transition-all hover:ring-[3px]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 leading-none font-semibold tracking-tight">
              <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-500/10 p-1">
                <OptimizedImage
                  src={ad.faviconUrl || SVG_PLACEHOLDER}
                  alt={`${ad.name} favicon`}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  isIcon
                />
              </div>
              <span className="text-foreground">{ad.name}</span>
            </h3>
            <p className="text-muted-foreground line-clamp-3 min-h-[60px] text-sm leading-relaxed">
              {ad.summary}
            </p>
          </div>
        </div>

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

export function AdSpot2Placement({ adMetadata }: { adMetadata?: AdMetadata }) {
  const content = (
    <Link
      prefetch={false}
      href="/advertise"
      className="border-border/40 bg-muted/20 hover:bg-muted/30 hover:border-ring/20 ring-ring/8 relative flex h-full flex-col rounded-lg border p-6 shadow-sm transition-all hover:ring-[3px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 leading-none font-semibold tracking-tight">
            <OptimizedImage
              src={env.NEXT_PUBLIC_CDN_URL + '/assets/logo.svg'}
              alt="AlternativeOSS"
              width={20}
              height={20}
              className="rounded-sm"
              isIcon
            />

            <span className="text-foreground">Ad Spot</span>
          </h3>

          <p className="text-muted-foreground min-h-[60px] text-sm">
            There is an opportunity to advertise on this website and reach a growing audience of
            tech enthusiasts, developers and founders.
            <span className="cursor-pointer font-bold text-zinc-200"> Click here</span> to learn
            more!
          </p>
        </div>
      </div>

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
