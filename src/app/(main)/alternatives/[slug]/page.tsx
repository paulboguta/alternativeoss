import { EmailCapture } from '@/components/email/email-capture';
import { ProjectCard } from '@/components/project/project-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getAlternatives } from '@/data-access/alternative';
import { getProjectsByAlternative } from '@/data-access/project';
import { getFaviconUrl } from '@/lib/favicon';
import { Command, HomeIcon } from 'lucide-react';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const alternatives = await getAlternatives();

  return alternatives.map(alternative => ({
    slug: alternative.slug,
  }));
}

async function AlternativePageContent(props: { params: Params }) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const { projects, alternative } = await getProjectsByAlternative(slug);

  if (!projects || !alternative) {
    notFound();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard
          key={project.name}
          name={project.name}
          summary={project.summary!}
          url={project.url!}
          repoStars={project.repoStars!}
          license={project.license.name}
          repoLastCommit={project.repoLastCommit!}
        />
      ))}
    </div>
  );
}

export default async function AlternativePage(props: { params: Params }) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const { projects, alternative } = await getProjectsByAlternative(slug);

  if (!projects || !alternative) {
    notFound();
  }

  return (
    <div className="px-8">
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
              <HomeIcon size={16} aria-hidden="true" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/alternatives" className="inline-flex items-center gap-1.5">
              <Command size={16} aria-hidden="true" />
              Alternatives
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{alternative.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex items-end gap-2">
          <Image
            src={getFaviconUrl(alternative.url || '')}
            alt={alternative.name}
            width={32}
            height={32}
          />
          <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">{alternative.name}</h1>
          <span className="text-muted-foreground text-xl font-medium">
            Open Source Alternatives
          </span>
        </div>
        <EmailCapture />
      </section>

      <section className="pb-24">
        <Suspense fallback={<div>Loading...</div>}>
          <AlternativePageContent params={props.params} />
        </Suspense>
      </section>
    </div>
  );
}
