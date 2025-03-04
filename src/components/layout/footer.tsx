import { websiteConfig } from '@/config/website';
import { getCategoriesWithCount } from '@/data-access/category';
import { getTrendingProjects } from '@/data-access/project';
import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { getAlternativesUseCase } from '@/use-cases/alternative';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import Link from 'next/link';
import { OptimizedImage } from '../ui/optimized-image';

const featuredOn = [
  {
    name: 'Startup Fame',
    href: 'https://startupfa.me/s/alternativeoss?utm_source=alternativeoss.com',
  },
];

export async function Footer() {
  'use cache';
  cacheTag('categories');
  cacheTag('trending-projects');

  const categoriesPromise = getCategoriesWithCount({ limit: 12 });
  const alternativesPromise = getAlternativesUseCase({ limit: 16, page: 1 });
  const trendingProjectsPromise = getTrendingProjects();

  const [categories, alternatives, trendingProjects] = await Promise.all([
    categoriesPromise,
    alternativesPromise,
    trendingProjectsPromise,
  ]);

  return (
    <div className="container-wrapper space-y-4">
      <div className="w-full space-y-2 border-t border-dashed px-8 pt-4">
        <div className="relative flex items-center gap-2">
          <div className="absolute top-1.5 -left-3 h-2 w-2 animate-pulse rounded-full bg-zinc-400/70"></div>
          <p className="pl-1 text-sm font-semibold">Trending Projects</p>
        </div>
        <div className="flex w-full flex-wrap gap-x-3 gap-y-1">
          {trendingProjects.map(project => (
            <Link
              prefetch={false}
              href={`/${project?.slug}`}
              key={project?.slug}
              className="hover:bg-muted/30 flex w-fit items-center gap-2 rounded-sm px-2 py-1 text-sm transition-colors"
            >
              <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-300/10 p-1">
                <OptimizedImage
                  isIcon
                  src={project?.faviconUrl ?? SVG_PLACEHOLDER}
                  alt={project?.name ?? ''}
                  width={18}
                  height={18}
                  className="rounded"
                />
              </div>
              <div className="font-medium text-white/80">{project?.name}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-2 border-y border-dashed px-8 py-4">
        <p className="pl-1 text-sm font-semibold">Trending Categories</p>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Link
              prefetch={false}
              href={`/categories/${category.slug}`}
              key={category.slug}
              className="hover:bg-muted/30 flex w-full items-center rounded-sm px-2 py-1 text-sm transition-colors"
            >
              <div className="font-medium text-white/80">{category.name}</div>

              <div className="border-muted-foreground/50 mx-2 flex-1 flex-grow border-t" />

              <div className="text-muted-foreground flex w-fit items-center gap-1">
                <p>{category.count}</p>
                <p>{category.count === 1 ? 'Alternative' : 'Alternatives'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full space-y-2 border-b border-dashed px-8 pb-4">
        <p className="pl-1 text-sm font-semibold">Trending Alternatives to:</p>
        <div className="flex w-full flex-wrap gap-x-2 gap-y-1">
          {alternatives.alternatives.map(alternative => (
            <Link
              prefetch={false}
              href={`/alternatives/${alternative.slug}`}
              key={alternative.slug}
              className="hover:bg-muted/30 w-fitrounded-sm px-2 py-1 text-sm transition-colors"
            >
              <div className="font-medium text-white/80">{alternative.name}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 border-b px-8 py-4 md:flex-row md:items-center md:justify-between md:gap-0">
        <p className="text-muted-foreground text-sm">
          Built with 💚 by{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:underline"
            href={websiteConfig.links.twitterPawel}
          >
            Pawel Boguta
          </Link>
        </p>
        {/* badges / links where the project was featured */}
        <div className="text-muted-foreground space-x-2 text-xs">
          <span>Featured on</span>
          {featuredOn.map(item => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="text-muted-foreground hover:underline"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
