import { CategoriesPageContent } from '@/components/category/categories-page-content';
import { EmailCapture } from '@/components/email/email-capture';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { websiteConfig } from '@/config/website';
import { getCategoriesWithCount } from '@/data-access/category';
import { generateCategoriesListJsonLd } from '@/lib/schema';
import { Command, HomeIcon } from 'lucide-react';
import { Metadata } from 'next';
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Open Source Software Categories';
  const description =
    'Explore open source software alternatives by category. Find free and open source alternatives for all your software needs.';

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://alternativeoss.com/categories',
      title,
      description,
      siteName: 'AlternativeOSS',
      images: [
        {
          url: websiteConfig.links.ogImage,
          width: 1200,
          height: 630,
          alt: 'Open Source Software Categories',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [websiteConfig.links.ogImage],
    },
    alternates: {
      canonical: 'https://alternativeoss.com/categories',
    },
    keywords: [
      'open source categories',
      'software categories',
      'open source software',
      'free software',
      'OSS',
      'FOSS',
      'software alternatives',
      'open source alternatives',
    ],
  };
}

// JSON-LD component for the categories list
function CategoriesListJsonLd({
  categories,
}: {
  categories: Awaited<ReturnType<typeof getCategoriesWithCount>>;
}) {
  const jsonLd = generateCategoriesListJsonLd(categories);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function CategoriesPage() {
  'use cache';
  cacheTag('categories');
  cacheLife('max');

  const categories = await getCategoriesWithCount();

  return (
    <>
      <CategoriesListJsonLd categories={categories} />
      <div className="px-8">
        <Breadcrumb className="mt-4 hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="inline-flex items-center gap-1.5">
                <HomeIcon size={16} aria-hidden="true" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Command size={16} aria-hidden="true" />
              Categories
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mx-auto flex flex-col gap-3 py-8 md:pb-8 lg:py-15 lg:pb-20">
          <div className="flex items-start gap-2 md:items-end">
            <h1 className="text-3xl leading-[1.1] font-bold tracking-tight">
              Discover Open Source Alternatives by Category
            </h1>
          </div>
          <EmailCapture />
        </section>

        <CategoriesPageContent categories={categories} />
      </div>
    </>
  );
}
