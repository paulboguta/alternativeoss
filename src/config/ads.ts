import { env } from '@/env';
import { getFaviconUrl } from '@/lib/favicon';

export const AD_PLACEMENT = {
  name: 'Ad Placement',
  version: 'A',
};

export const MOCK_AD = {
  url: 'https://alternativeoss.com',
  name: 'AlternativeOSS',
  summary:
    'Best directory of open source alternatives to popular tools on the internet. Discover new projects, get inspired and submit your own.',
  faviconUrl: getFaviconUrl('alternativeoss.com'),
};

// App launch date - 5 days ago
export const LAUNCH_DATE = new Date('2025-02-28');
export const DAYS_SINCE_LAUNCH = Math.floor(
  (Date.now() - LAUNCH_DATE.getTime()) / (24 * 60 * 60 * 1000)
);

// Discount end date - 30 days from launch
export const DISCOUNT_END_DATE = new Date('2025-04-30');

export const FEAUTRED_ON = [
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/item?id=43219052',
    logo: `${env.NEXT_PUBLIC_CDN_URL}/assets/hackernews.webp`,
  },
];

// Country visitor data (up to 04.03.2025) later hook up plausible
export const COUNTRY_VISITORS = [
  { country: '🇺🇸 United States', visitors: 903, percentage: 45 },
  { country: '🇩🇪 Germany', visitors: 388, percentage: 19 },
  { country: '🇬🇧 United Kingdom', visitors: 160, percentage: 8 },
  { country: '🇨🇦 Canada', visitors: 128, percentage: 6 },
  { country: '🇫🇷 France', visitors: 121, percentage: 6 },
  { country: '🇮🇳 India', visitors: 117, percentage: 6 },
  { country: '🇳🇱 Netherlands', visitors: 100, percentage: 5 },
  { country: '🇵🇱 Poland', visitors: 84, percentage: 4 },
];

// Pricing card data for advertisement options
export type PricingCardData = {
  title: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  availableSpots: number;
  demoLink: string;
};

export const PRICING_CARDS: PricingCardData[] = [
  {
    title: 'Ad Spot 1',
    price: '$3',
    originalPrice: '$12',
    period: 'per day',
    description: 'Featured on all project pages',
    features: [
      'High visibility placement',
      'Appears on all listing pages',
      'Direct link to your website',
    ],
    availableSpots: 10,
    demoLink: '/advertise/ad-spot-1',
  },
  {
    title: 'Ad Spot 2',
    price: '$8',
    originalPrice: '$24',
    period: 'per day',
    description: 'Placement on the main page',
    features: [
      'Featured on the homepage',
      'High-traffic visibility',
      'Featured on the alternatives',
    ],
    availableSpots: 1,
    demoLink: '/advertise/ad-spot-2',
  },
  {
    title: 'Sponsor (Header)',
    price: '$300',
    originalPrice: '$999',
    period: 'per month',
    description: 'Branding in the site header',
    features: ['Appears in the site header', 'Brand recognition', 'Maximum visibility'],
    featured: true,
    availableSpots: 1,
    demoLink: '/advertise/sponsor-header',
  },
  {
    title: 'Sponsor (Toolbar)',
    price: '$100',
    originalPrice: '$300',
    period: 'per month',
    description: 'Branding in the site toolbar',
    features: [
      'Appears in the site toolbar',
      'Present on important pages',
      'Consistent brand exposure',
    ],
    availableSpots: 2,
    demoLink: '/advertise/sponsor-toolbar',
  },
];
