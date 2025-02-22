import { mockProjects } from "@/app/(main)/page";
import { Icons } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getFaviconUrl } from "@/lib/favicon";
import { buildProjectUrl } from "@/utils/url";
import {
  ArrowRightIcon,
  Clock7,
  Command,
  GitFork,
  HomeIcon,
  Scale,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import slugify from "slugify";

// Mock alternatives for now
const alternatives = [
  { name: "Loom", url: "https://loom.com" },
  { name: "Screen Studio", url: "https://screen.studio" },
  { name: "ScreenshotOne", url: "https://screenshotone.com/" },
  { name: "Bandicam", url: "https://bandicam.com" },
  { name: "CleanShot", url: "https://cleanshot.com" },
];

// Mock categories
const projectCategories = [
  { name: "Screen Recording", count: 15 },
  { name: "API Tools", count: 28 },
  { name: "Cloud Infrastructure", count: 156 },
];

const exploreCategories = [
  { name: "Analytics", count: 24 },
  { name: "Authentication", count: 18 },
  { name: "CMS", count: 32 },
  { name: "Databases", count: 45 },
  { name: "DevOps", count: 56 },
  { name: "Email", count: 12 },
];

type Props = {
  params: {
    project: string;
  };
};

export default async function ProjectPage({ params }: Props) {
  const project = mockProjects.find(
    (p) =>
      slugify(p.name, { lower: true, locale: "en", strict: true }) ===
      params.project
  );

  if (!project) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[280px_auto] pr-8 lg:pr-0 lg:grid-cols-[280px_auto_300px] gap-8">
        <aside className="md:border-r border-dashed px-0 md:px-8 md:py-8 order-2 md:order-1">
          <div className="md:sticky md:top-24 space-y-6">
            {/* Alternatives */}
            <div className="space-y-2 ">
              <h2 className="text-sm font-medium text-bg/60">Alternative to</h2>
              <div className="flex gap-x-1 flex-wrap w-full">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.name}
                    href={`/alternatives/${slugify(alt.name, {
                      lower: true,
                    })}`}
                    className="flex items-center gap-1.5 group hover:bg-accent/50 rounded-md px-1.5 py-1 transition-colors w-fit"
                  >
                    <div className="flex items-center justify-center rounded-md ">
                      <Image
                        src={getFaviconUrl(alt.url)}
                        alt={`${alt.name} favicon`}
                        width={12}
                        height={12}
                        className="rounded-sm"
                      />
                    </div>
                    <span className="text-xs font-medium group-hover:text-foreground text-muted-foreground">
                      {alt.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-bg/60 ">Categories</h3>
              <div className="flex flex-wrap gap-1.5">
                {projectCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${slugify(category.name, {
                      lower: true,
                    })}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors group"
                  >
                    <span>{category.name}</span>
                    <span className="inline-flex items-center rounded bg-background/80 px-1 py-0.5 text-[10px] font-medium">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-bg/60 ">
                Explore other categories
              </h3>
              <div className="flex flex-col gap-1">
                {exploreCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/category/${slugify(category.name, {
                      lower: true,
                    })}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors group"
                  >
                    <span className="text-xs font-medium group-hover:text-foreground text-muted-foreground">
                      {category.name}
                    </span>
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 py-8 w-full order-1 md:order-2">
          <div className="space-y-8">
            <Breadcrumb>
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
                    href="#"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Command size={16} aria-hidden="true" />
                    Open Source Tools
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{project.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="space-y-4 lg:flex lg:items-start lg:justify-between lg:space-y-0">
              <div className="flex items-center gap-4">
                <div className="flex p-1.5 items-center justify-center rounded-lg bg-zinc-300/10 border border-zinc-800">
                  <Image
                    src={getFaviconUrl(project.url)}
                    alt={`${project.name} favicon`}
                    width={32}
                    height={32}
                    className="rounded-sm"
                  />
                </div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
              </div>
              <div className="flex gap-4">
                <Button className="group" variant="secondary" asChild>
                  <Link
                    href={buildProjectUrl(project)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {project.name}
                    <ArrowRightIcon
                      className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                {/* Mobile only */}
                <Button variant="outline" asChild className="lg:hidden">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.gitHub className="mr-2 h-4 w-4" />
                    View Repository
                  </Link>
                </Button>
              </div>
            </div>
            <p className=" text-muted-foreground">{project.summary}</p>

            {/* Repository Stats - Mobile/Tablet */}
            <div className="lg:hidden rounded-lg border bg-card/50 p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {project.repoStars.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {project.repoForks.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">forks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{project.license}</span>
                  <span className="text-xs text-muted-foreground">license</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock7 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last commit {formatDate(project.repoLastCommit)}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/30">
              <Image
                src="/image.png"
                alt={`${project.name} demo screenshot`}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  About {project.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Key Features
                </h2>
                <ul className="space-y-3 pl-4">
                  {project.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-primary/70"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block py-8 px-8 order-3">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-lg border bg-card/50 px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {project.repoStars.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {project.repoForks.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">forks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{project.license}</span>
                  <span className="text-xs text-muted-foreground">license</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock7 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last commit {formatDate(project.repoLastCommit)}
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="lg" className="w-full " asChild>
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.gitHub />
                View Repository
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
