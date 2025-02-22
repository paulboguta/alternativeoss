import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { getFaviconUrl } from "@/lib/favicon";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";

type ProjectCardProps = {
  name: string;
  summary: string;
  url: string;
  repoStars: number;
  license: string;
  repoLastCommit: Date;
};

export function ProjectCard({
  name,
  summary,
  url,
  repoStars,
  license,
  repoLastCommit,
}: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Link
      href={`/${slugify(name, { lower: true, locale: "en", strict: true })}`}
      className="block"
    >
      <div className="relative flex h-full flex-col rounded-lg border border-border/50 bg-card p-6 transition-colors hover:bg-accent/10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 font-semibold leading-none tracking-tight">
              <Image
                src={getFaviconUrl(url)}
                alt={`${name} favicon`}
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span className="text-foreground">{name}</span>
            </h3>
            <p className="min-h-[60px] text-sm text-muted-foreground line-clamp-3">
              {summary}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Icons.gitHub className="h-4 w-4" />
            <span>{repoStars.toLocaleString()} stars</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="text-[13px]">
              Last commit {formatDate(repoLastCommit)}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>{license}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
