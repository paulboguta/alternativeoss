import { EmailCapture } from "@/components/email/email-capture";
import { Pagination } from "@/components/pagination";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/data-access/project";
import { Project } from "@/db/types";
import { ITEMS_PER_PAGE, searchParams } from "@/lib/search-params";
import { SearchParams } from "nuqs/server";

// Generate static pages for the first 5 pages at build time
export async function generateStaticParams() {
  const projects = await getProjects();
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const pagesToGenerate = Math.min(5, totalPages);
  
  return Array.from({ length: pagesToGenerate }, (_, i) => ({
    searchParams: { page: (i + 1).toString() }
  }));
}

export default async function HomePage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const awaitedParams = await props.searchParams;

  const { page } = Object.fromEntries(
    Object.entries(searchParams).map(([key, parser]) => [
      key,
      parser.parseServerSide(awaitedParams[key]),
    ])
  );

  const currentPage = page ?? 1;
  const projects = await getProjects();

  // Calculate pagination values
  const totalProjects = projects.length;
  const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(startIndex, endIndex);

  // Create URL for pagination
  const createUrl = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight">
          Discover Open Source Software
        </h1>
        <EmailCapture />
      </section>

      <section className="pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project: Project & { license: { name: string } }) => (
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

        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createUrl={createUrl}
          />
        </div>
      </section>
    </div>
  );
}
