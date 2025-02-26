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
import { getCategories } from '@/data-access/category';
import { getProjectsByCategory } from '@/data-access/project';
import { Command, HomeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map(category => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage(props: { params: Params }) {
  const { slug } = await props.params;
  if (!slug) {
    notFound();
  }

  const { projects, category } = await getProjectsByCategory(slug);

  if (!projects || !category) {
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
            <BreadcrumbLink href="/categories" className="inline-flex items-center gap-1.5">
              <Command size={16} aria-hidden="true" />
              Project Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="mx-auto flex flex-col gap-3 md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex items-end gap-1">
          <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">{category.name}</h1>
          <span className="text-muted-foreground text-xl font-medium">
            Open Source Alternatives
          </span>
        </div>
        <EmailCapture />
      </section>

      <section className="pb-24">
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
      </section>
    </div>
  );
}
