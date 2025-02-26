import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { getFaviconUrl } from '@/lib/favicon';
import { RequiredProjectData } from '@/types/project';
import { buildProjectUrl } from '@/utils/url';
import { ArrowRightIcon, Command, HomeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '../icons';

type PageContentProps = {
  project: RequiredProjectData;
};

function ProjectBreadcrumb({ projectName }: { projectName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
            <HomeIcon size={16} aria-hidden="true" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
            <Command size={16} aria-hidden="true" />
            Open Source Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{projectName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ProjectHeader({ name, url, repoUrl }: { name: string; url: string; repoUrl: string }) {
  return (
    <div className="space-y-4 lg:flex lg:items-start lg:justify-between lg:space-y-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-300/10 p-1.5">
          <Image
            src={getFaviconUrl(url)}
            alt={`${name} favicon`}
            width={32}
            height={32}
            className="rounded-sm"
          />
        </div>
        <h1 className="text-3xl font-bold">{name}</h1>
      </div>
      <div className="flex gap-4">
        <Button className="group" variant="secondary" asChild>
          <Link href={buildProjectUrl({ url, name })} target="_blank" rel="noopener noreferrer">
            Visit {name}
            <ArrowRightIcon
              className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
          </Link>
        </Button>
        {/* Mobile only */}
        <Button variant="outline" asChild className="lg:hidden">
          <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            View Repository
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ProjectScreenshot({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="bg-muted/30 relative aspect-video w-full overflow-hidden rounded-lg border">
      <Image
        src={`${env.NEXT_PUBLIC_CDN_URL}/${slug}.webp`}
        alt={`${name} demo screenshot`}
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
}

function ProjectFeatures({ features }: { features: string[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Key Features</h2>
      <ul className="space-y-3 pl-4">
        {features.map((feature, index) => (
          <li key={index} className="text-muted-foreground flex items-center gap-3">
            <div className="bg-primary/70 h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectContent({ project }: PageContentProps) {
  return (
    <div className="space-y-8">
      <ProjectBreadcrumb projectName={project.name} />
      <ProjectHeader name={project.name} url={project.url || ''} repoUrl={project.repoUrl} />
      <p className="text-muted-foreground">{project.summary}</p>

      {/* ProjectStats is now handled at the page level */}
      <ProjectScreenshot slug={project.slug} name={project.name} />
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">About {project.name}</h2>
          <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
        </div>
        <ProjectFeatures features={project.features} />
      </div>
    </div>
  );
}
