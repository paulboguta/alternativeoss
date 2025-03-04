import { AdSpot3 } from '@/components/ads/ad-spot-3';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { MOCK_AD } from '@/config/ads';
import { env } from '@/env';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default function SponsorHeaderDemoPage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-16">
        <div className="space-y-2">
          <Link
            prefetch={false}
            href="/advertise"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Advertise
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Header Sponsor Demo</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          This is how your sponsor badge will appear in the site header on every page.
        </p>
      </section>

      <section className="max-w-5xl pb-16">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="mb-4 text-lg font-medium">Live Preview</h2>
            <div className="border-border/50 bg-background flex items-center justify-center rounded-md border border-dashed p-6">
              <AdSpot3 url={MOCK_AD.url} name={MOCK_AD.name} faviconUrl={MOCK_AD.faviconUrl} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-medium">Placement Example</h2>
            <div className="bg-muted/30 relative aspect-video w-full overflow-hidden rounded-lg border">
              <OptimizedImage
                src={`${env.NEXT_PUBLIC_CDN_URL}/assets/ad-spot-4.webp`}
                alt="Ad Spot 4 placement example"
                fill
                className="object-cover object-center"
                priority
                role="hero"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
