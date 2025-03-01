import { AlternativesContent } from '@/components/alternative/alternatives-content';
import { AlternativesHeader } from '@/components/alternative/alternatives-header';
import { SkeletonAlternativesContent } from '@/components/alternative/skeleton-alternatives';
import { Toolbar } from '@/components/toolbar/toolbar';
import { ToolbarSkeleton } from '@/components/toolbar/toolbar-skeleton';
import { ALTERNATIVES_SORT_OPTIONS, DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';
import { websiteConfig } from '@/config/website';

import { AlternativeSortField } from '@/types/sorting';

import { Metadata } from 'next';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Open Source Software Alternatives';
  const description =
    'Discover the best open source alternatives to popular software. Find free and open source alternatives for all your software needs.';

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://alternativeoss.com/alternatives',
      title,
      description,
      siteName: 'AlternativeOSS',
      images: [
        {
          url: websiteConfig.links.ogImage,
          width: 1200,
          height: 630,
          alt: 'Open Source Software Alternatives',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [websiteConfig.links.ogImage],
    },
    alternates: {
      canonical: 'https://alternativeoss.com/alternatives',
    },
    keywords: [
      'open source alternatives',
      'software alternatives',
      'open source software',
      'free software',
      'OSS',
      'FOSS',
      'alternative software',
      'free and open source alternatives',
    ],
  };
}

export default async function AlternativesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const awaitedSearchParams = await searchParams;

  return (
    <>
      <AlternativesHeader />

      <Suspense fallback={<ToolbarSkeleton />}>
        <Toolbar<AlternativeSortField>
          defaultSort={DEFAULT_SORT_ALTERNATIVES}
          sortOptions={ALTERNATIVES_SORT_OPTIONS}
          searchPlaceholder="Search alternatives..."
        />
      </Suspense>

      <section className="px-8 pb-24">
        <Suspense fallback={<SkeletonAlternativesContent />}>
          <AlternativesContent searchParams={awaitedSearchParams} />
        </Suspense>
      </section>
    </>
  );
}
