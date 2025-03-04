import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DISCOUNT_END_DATE, PRICING_CARDS } from '@/config/ads';
import { websiteConfig } from '@/config/website';
import { differenceInDays } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';
import { PricingCard } from './pricing-card';

export function PricingSection() {
  // Calculate days left until discount ends
  const daysLeft = differenceInDays(DISCOUNT_END_DATE, new Date());

  return (
    <section className="max-w-6xl pb-24">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Pricing</h2>
          <div className="relative flex items-center">
            <Badge className="rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              75% OFF Launch Discount
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground">
          As the site grows, we will increase the number of available spots for each ad type, but
          you can lock the price today.{' '}
          <span className="font-medium text-zinc-100/80">
            Only {daysLeft} days left at this price!
          </span>
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {PRICING_CARDS.map((card, index) => (
          <PricingCard
            key={index}
            title={card.title}
            price={card.price}
            originalPrice={card.originalPrice}
            period={card.period}
            description={card.description}
            features={card.features}
            featured={card.featured}
            availableSpots={card.availableSpots}
          />
        ))}
      </div>

      <div className="mt-12">
        <p className="text-muted-foreground mb-6">
          Interested in advertising with us? Get in touch to secure your spot.
        </p>
        <div className="flex items-center gap-2">
          <Button size="lg" className="group" asChild>
            <a href={`mailto:${websiteConfig.email}`}>
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <div className="text-muted-foreground text-sm">
            or email us at <strong>{websiteConfig.email}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
