import { RightSidebar } from '@/components/project/left-sidebar';
import { ProjectContent } from '@/components/project/project-content';
import {
  AlternativesSkeleton,
  CategoriesSkeleton,
  OtherCategoriesSkeleton,
  ProjectStatsSkeleton,
} from '@/components/project/skeleton-project-page';
import {
  getAllProjects,
  getOtherCategoriesWithCount,
  getProject,
  getProjectAlternatives,
  getProjectCategoriesWithCount,
} from '@/data-access/project';
import { generateProjectJsonLd } from '@/lib/schema';
import { isValidProjectData } from '@/types/project';

import { OtherCategories } from '@/components/project/other-categories';
import { ProjectAlternatives } from '@/components/project/project-alternatives';
import { ProjectCategories } from '@/components/project/project-categories';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { cache, Suspense } from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project || !isValidProjectData(project)) {
    notFound();
  }

  const title = project.name;
  const description =
    project.summary ||
    `Explore ${project.name} - an open source software alternative on AlternativeOSS`;

  const imageUrl = `https://alternativeoss.com/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `https://alternativeoss.com/${slug}`,
      title,
      description,
      siteName: 'AlternativeOSS',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} - Open Source Software Alternative`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://alternativeoss.com/${slug}`,
    },
    keywords: [
      project.name,
      'open source',
      'alternative',
      'software',
      'OSS',
      'FOSS',
      `${project.name} open source alternative`,
      ...(project.features || []),
    ],
  };
}

// JSON-LD component for the project
async function ProjectJsonLd({ project }: { project: Awaited<ReturnType<typeof findProject>> }) {
  const jsonLd = generateProjectJsonLd(project);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map(project => ({
    slug: project.slug,
  }));
}

const findProject = cache(async (props: PageProps) => {
  const { slug } = await props.params;

  const project = await getProject(slug);

  if (!project || !isValidProjectData(project)) {
    notFound();
  }

  return project;
});

async function LeftSidebar({ projectId }: { projectId: number }) {
  'use cache';
  cacheTag(`project/${projectId}`);

  const [projectCategories, otherCategories, projectAlternatives] = await Promise.all([
    getProjectCategoriesWithCount(projectId),
    getOtherCategoriesWithCount(projectId),
    getProjectAlternatives(projectId),
  ]);

  return (
    <aside className="border-dashed px-8 pt-4 pb-0 md:border-r md:pt-0">
      <div className="space-y-6 md:sticky md:top-24">
        <ProjectAlternatives alternatives={projectAlternatives} />
        <ProjectCategories categories={projectCategories} />
        <OtherCategories categories={otherCategories} />
      </div>
    </aside>
  );
}

export default async function ProjectPage(props: PageProps) {
  const project = await findProject(props);

  return (
    <>
      <ProjectJsonLd project={project} />
      <div className="relative min-h-screen">
        <div className="grid grid-cols-1 gap-8 pr-8 md:grid-cols-[300px_auto] lg:grid-cols-[300px_auto_300px] lg:pr-0">
          <Suspense
            fallback={
              <aside className="border-dashed px-8 pt-4 pb-0 md:border-r md:pt-0">
                <div className="space-y-6 md:sticky md:top-24">
                  <AlternativesSkeleton />
                  <CategoriesSkeleton />
                  <OtherCategoriesSkeleton />
                </div>
              </aside>
            }
          >
            <LeftSidebar projectId={project.id} />
          </Suspense>

          <main className="w-full min-w-0 px-8 py-4 md:px-0 md:py-8">
            <ProjectContent project={project} />
          </main>

          <Suspense fallback={<ProjectStatsSkeleton />}>
            <RightSidebar slug={project.slug} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
