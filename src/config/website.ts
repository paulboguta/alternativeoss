import type { Metadata } from 'next';

export type WebsiteConfig = {
  version: string;
  name: string;
  domain: string;
  description: string;
  status: 'waitlist' | 'public';
  links: {
    github: string;
    twitterPawel: string;
  };
};

export const websiteConfig: WebsiteConfig = {
  version: 'beta.0.2',
  name: 'AlternativeOSS',
  domain: 'alternativeoss.com',
  description: 'Open Source Software Alternatives Directory',
  status: 'waitlist',
  links: {
    github: 'https://github.com/paulboguta/alternativeoss',
    twitterPawel: 'https://x.com/pawelboguta',
  },
};

export const metadata: Metadata = {
  title: {
    default: 'AlternativeOSS - Open Source Software Alternatives Directory',
    template: '%s | AlternativeOSS',
  },
  description:
    'Discover the best open source alternatives to popular software. A comprehensive directory of open source software alternatives for all your needs.',
  keywords: [
    'open source',
    'open source alternatives',
    'free software',
    'software alternatives',
    'OSS',
    'FOSS',
    'free and open source software',
    'software directory',
    'alternative software',
    'open source directory',
  ],
  authors: [
    {
      name: 'Pawel Boguta',
      url: 'https://x.com/pawelboguta',
    },
  ],
  creator: 'Pawel Boguta',
  publisher: 'AlternativeOSS',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alternativeoss.com',
    title: 'AlternativeOSS - Open Source Software Alternatives Directory',
    description:
      'Discover the best open source alternatives to popular software. A comprehensive directory of open source software alternatives for all your needs.',
    siteName: 'AlternativeOSS',
    images: [
      {
        url: 'https://alternativeoss.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AlternativeOSS - Open Source Software Alternatives Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlternativeOSS - Open Source Software Alternatives Directory',
    description:
      'Discover the best open source alternatives to popular software. A comprehensive directory of open source software alternatives for all your needs.',
    creator: '@pawelboguta',
    images: ['https://alternativeoss.com/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
