import { ProjectCard } from "@/components/project-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjectsByCategory } from "@/data-access/project";
import { Command, HomeIcon } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: Props) {
  const awaitedParams = await params;

  const { projects, category } = await getProjectsByCategory(
    awaitedParams.category
  );

  if (!projects) {
    notFound();
  }

  return (
    <div className="px-8">
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="inline-flex items-center gap-1.5"
            >
              <HomeIcon size={16} aria-hidden="true" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/categories"
              className="inline-flex items-center gap-1.5"
            >
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

      <section className="mx-auto flex flex-col gap-3  md:py-4 md:pb-8 lg:py-15 lg:pb-20">
        <div className="flex gap-1 items-end">
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight">
            {category.name}
          </h1>
          <span className="text-muted-foreground font-medium text-2xl">
            Open Source Alternatives
          </span>
        </div>
        <p className="max-w-[550px] text-lg text-white font-light leading-tight">
          Find and compare the best open source alternatives to popular software
          tools. Join our community of 3300+ creators.
        </p>
        <div className="mt-3 flex w-full max-w-sm space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-9 focus-visible:ring-1"
          />
          <Button type="submit" className="h-9">
            Subscribe
          </Button>
        </div>
      </section>

      <section className="pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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
