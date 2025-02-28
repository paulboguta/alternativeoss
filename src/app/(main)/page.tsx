import { EmailCapture } from '@/components/email/email-capture';
import { ProjectsContent } from '@/components/project/projects-content';
import { SkeletonProjectsContent } from '@/components/project/skeleton-projects';
import { Toolbar } from '@/components/toolbar/toolbar';
import { ToolbarSkeleton } from '@/components/toolbar/toolbar-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export default async function HomePage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <section className="mx-auto mb-6 flex flex-col gap-3 px-8 py-12 lg:py-20">
        <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
          Discover Open Source Software
        </h1>
        <EmailCapture />
      </section>

      <Suspense fallback={<ToolbarSkeleton />}>
        <Toolbar searchParams={searchParams} />
      </Suspense>

      <section className="px-8 pb-24">
        <Suspense fallback={<SkeletonProjectsContent />}>
          <ProjectsContent searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
