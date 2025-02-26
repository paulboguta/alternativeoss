import { CategoryHeader } from '@/components/category/category-header';
import { CategoryPageContent } from '@/components/category/category-page-content';
import { CategoryHeaderSkeleton } from '@/components/category/skeleton-category-header';
import { CategoryContentSkeleton } from '@/components/category/skeleton-category-page-content';
import { getCategories } from '@/data-access/category';
import { getProjectsByCategory } from '@/data-access/project';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import { cache, Suspense } from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

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
  );
}
