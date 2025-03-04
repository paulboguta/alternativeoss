'use client';

import { FeaturedOn } from '@/components/ads/featured-on';
import { PricingSection } from '@/components/ads/pricing-section';
import { Stats } from '@/components/ads/stats';

export default function AdvertisePage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-10">
        <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
          Advertise on AlternativeOSS
        </h1>
        <p className="text-muted-foreground max-w-[550px] text-lg leading-tight font-light">
          Reach thousands of tech enthusiasts looking for open source alternatives to popular
          software tools.
        </p>

        <div className="border-primary/30 mt-6 max-w-[650px] space-y-1 border-l-2 py-2 pl-4">
          <p className="text-sm leading-relaxed">
            <strong>Our commitment:</strong> There are NO featured or paid listings on
            AlternativeOSS.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All open source projects shown are included based on usefulness, activity, but never
            payment. The only way we monetize is through clearly marked advertisements and sponsors,
            keeping our recommendations authentic and trustworthy. Moreover, the advertisements are
            vetted so they are related to tech and are actually useful.
          </p>
        </div>
      </section>

      <Stats />
      <FeaturedOn />
      <PricingSection />
    </div>
  );
}
