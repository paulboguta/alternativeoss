import { AlternativeHeader } from '@/components/alternative/alternative-header';
import { AlternativePageContent } from '@/components/alternative/alternative-page-content';
import { AlternativeHeaderSkeleton } from '@/components/alternative/skeleton-alternative-header';
import { AlternativeContentSkeleton } from '@/components/alternative/skeleton-alternative-page-content';
import { getAlternatives } from '@/data-access/alternative';
import { getProjectsByAlternative } from '@/data-access/project';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const alternatives = await getAlternatives();

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
  );
}
