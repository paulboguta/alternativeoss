import { AlternativeHeader } from '@/components/alternative/alternative-header';
import { AlternativePageContent } from '@/components/alternative/alternative-page-content';
import { AlternativeHeaderSkeleton } from '@/components/alternative/skeleton-alternative-header';
import { AlternativeContentSkeleton } from '@/components/alternative/skeleton-alternative-page-content';
import { getAlternatives } from '@/data-access/alternative';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const alternatives = await getAlternatives();

  return alternatives.map(alternative => ({
    slug: alternative.slug,
  }));
}

export default async function AlternativePage(props: { params: Params }) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="px-8">
      <Suspense fallback={<AlternativeHeaderSkeleton />}>
        <AlternativeHeader slug={slug} />
      </Suspense>
      <section className="pb-24">
        <Suspense fallback={<AlternativeContentSkeleton />}>
          <AlternativePageContent slug={slug} />
        </Suspense>
      </section>
    </div>
  );
}
