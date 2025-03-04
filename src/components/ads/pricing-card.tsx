import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PRICING_CARDS } from '@/config/ads';
import { websiteConfig } from '@/config/website';
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { GetStartedButton } from './analytics';

type PricingCardProps = {
  title: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  availableSpots?: number;
};

export function PricingCard({
  title,
  price,
  originalPrice,
  period,
  description,
  features,
  featured = false,
  availableSpots,
}: PricingCardProps) {
  // Get the demo link from the pricing cards config
  const demoLink = PRICING_CARDS.find(card => card.title === title)?.demoLink || '/advertise';

  return (
    <Card
      className={`border-border/50 ${featured ? 'bg-muted/30 ring-border ring-1' : 'bg-card/50'} relative h-full overflow-hidden`}
    >
      <CardHeader className="flex flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {availableSpots !== undefined && (
            <Badge variant="outline" className="text-xs">
              {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'}
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-bold">{price}</span>
          {originalPrice && (
            <span className="text-muted-foreground ml-2 text-sm line-through">{originalPrice}</span>
          )}
          <span className="text-muted-foreground ml-1 text-sm">{period}</span>
        </div>
        <Separator />
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-emerald-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <GetStartedButton
          className="group w-full cursor-pointer"
          variant={featured ? 'default' : 'secondary'}
        >
          <a href={`mailto:${websiteConfig.email}`}>
            Get Started
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </GetStartedButton>
        <Link
          href={demoLink}
          className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1 text-xs transition-colors"
        >
          Check Demo Listing <ArrowUpRightIcon className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
