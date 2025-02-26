import { CategoryHeader } from '@/components/category/category-header';
import { CategoryPageContent } from '@/components/category/category-page-content';
import { CategoryHeaderSkeleton } from '@/components/category/skeleton-category-header';
import { CategoryContentSkeleton } from '@/components/category/skeleton-category-page-content';
import { getCategories } from '@/data-access/category';
import { getProjectsByCategory } from '@/data-access/project';
import { generateCategoryJsonLd } from '@/lib/schema';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { cache, Suspense } from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { category, projects } = await getProjectsByCategory(slug);

  if (!category) {
    notFound();
  }

  const title = `${category.name} Open Source Software`;
  const description = `Explore the best open source ${category.name.toLowerCase()} software. Find free and open source alternatives for your ${category.name.toLowerCase()} needs.`;
  
  const imageUrl = `https://alternativeoss.com/og-image.png`;

  const projectCount = projects?.length || 0;
  
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://alternativeoss.com/categories/${slug}`,
      title,
      description,
      siteName: "AlternativeOSS",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} Open Source Software - ${projectCount} Projects`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://alternativeoss.com/categories/${slug}`,
    },
    keywords: [
      category.name,
      `${category.name} software`,
      `${category.name} open source`,
      `${category.name} free software`,
      "open source",
      "free software",
      "OSS",
      "FOSS",
    ],
  };
}

// JSON-LD component for the category
function CategoryJsonLd({ 
  category, 
  projects 
}: { 
  category: Awaited<ReturnType<typeof findCategory>>["category"];
  projects: Awaited<ReturnType<typeof findCategory>>["projects"];
}) {
  const jsonLd = generateCategoryJsonLd(category, projects);
  
  if (!jsonLd) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}


export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map(category => ({
    slug: category.slug,
  }));
}

const findCategory = cache(async (props: PageProps) => {
  const { slug } = await props.params;

  const { category, projects } = await getProjectsByCategory(slug);

  if (!category) {
    notFound();
  }

  return { category, projects };
});


export default async function CategoryPage(props: PageProps) {
  const { category, projects } = await findCategory(props);

  if (!projects || !category) {
    notFound();
  }

  return (
    <>
      <CategoryJsonLd category={category} projects={projects} />
      <div className="px-8">
        <Suspense fallback={<CategoryHeaderSkeleton />}>
          <CategoryHeader category={category} />
        </Suspense>

        <Suspense fallback={<CategoryContentSkeleton />}>
          <section className="pb-24">
            <CategoryPageContent projects={projects} />
          </section>
        </Suspense>
      </div>
    </>
  );
}
