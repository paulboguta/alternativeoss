import { EmailCapture } from '@/components/email/email-capture';
import { ProjectsContent } from '@/components/project/projects-content';
import { SkeletonProjectsContent } from '@/components/project/skeleton-projects';
import { Toolbar } from '@/components/toolbar/toolbar';
import { ToolbarSkeleton } from '@/components/toolbar/toolbar-skeleton';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export default function HomePage(props: { searchParams: Promise<SearchParams> }) {
  return (
    <div className="px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
          Discover Open Source Software
        </h1>
        <EmailCapture />
      </section>

      <Suspense fallback={<ToolbarSkeleton />}>
        <Toolbar searchParams={props.searchParams} />
      </Suspense>

      <section className="pb-24">
        <Suspense fallback={<SkeletonProjectsContent />}>
          <ProjectsContent searchParams={props.searchParams} />
        </Suspense>
      </section>
    </div>
  );
}
