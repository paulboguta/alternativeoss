import { AlternativeHeader } from '@/components/alternative/alternative-header';
import { AlternativePageContent } from '@/components/alternative/alternative-page-content';
import { AlternativeHeaderSkeleton } from '@/components/alternative/skeleton-alternative-header';
import { AlternativeContentSkeleton } from '@/components/alternative/skeleton-alternative-page-content';
import { websiteConfig } from '@/config/website';
import { getAllAlternatives } from '@/data-access/alternative';
import { getProjectsByAlternative } from '@/data-access/project';
import { generateAlternativeJsonLd } from '@/lib/schema';
import { notFound } from 'next/navigation';

import { cache, Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;

  const result = await getProjectsByAlternative(slug);

  if (!result.alternative) {
    notFound();
  }

  const { alternative } = result;

  const title = `${alternative.name} Alternatives`;
  const description =
    alternative.description ||
    `Discover the best open source alternatives to ${alternative.name}. Compare features, pricing, and find the right software for your needs.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://alternativeoss.com/alternatives/${slug}`,
      title,
      description,
      siteName: 'AlternativeOSS',
      images: [
        {
          url: websiteConfig.links.ogImage,
          width: 1200,
          height: 630,
          alt: `${alternative.name} Open Source Alternatives`,
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
      canonical: `https://alternativeoss.com/alternatives/${slug}`,
    },
    keywords: [
      alternative.name,
      `${alternative.name} alternatives`,
      `${alternative.name} open source`,
      'open source alternatives',
      'software alternatives',
      'free alternatives',
      'OSS',
      'FOSS',
    ],
  };
}

// JSON-LD component for the alternative
function AlternativeJsonLd({
  alternative,
  projects,
}: {
  alternative: Awaited<ReturnType<typeof findAlternative>>['alternative'];
  projects: Awaited<ReturnType<typeof findAlternative>>['projects'];
}) {
  const jsonLd = generateAlternativeJsonLd(alternative, projects);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export async function generateStaticParams() {
  const alternatives = await getAllAlternatives();

  return alternatives.map(alternative => ({
    slug: alternative.slug,
  }));
}

const findAlternative = cache(async (slug: string) => {
  const result = await getProjectsByAlternative(slug);

  if (!result.alternative) {
    notFound();
  }

  return { alternative: result.alternative, projects: result.projects };
});

export default async function AlternativePage(props: { params: Params }) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const { alternative, projects } = await findAlternative(slug);

  if (!projects || !alternative) {
    notFound();
  }

  return (
    <>
      <AlternativeJsonLd alternative={alternative} projects={projects} />
      <div className="px-8">
        <Suspense fallback={<AlternativeHeaderSkeleton />}>
          <AlternativeHeader alternative={alternative} />
        </Suspense>
        <section className="pb-24">
          <Suspense fallback={<AlternativeContentSkeleton />}>
            <AlternativePageContent projects={projects} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
