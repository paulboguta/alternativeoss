import { CategoryHeader } from '@/components/category/category-header';
import { CategoryPageContent } from '@/components/category/category-page-content';
import { CategoryHeaderSkeleton } from '@/components/category/skeleton-category-header';
import { CategoryContentSkeleton } from '@/components/category/skeleton-category-page-content';
import { getCategories } from '@/data-access/category';
import { getProjectsByCategory } from '@/data-access/project';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map(category => ({
    slug: category.slug,
  }));
}

const findCategory = cache(async (slug: string) => {
  const { category, projects } = await getProjectsByCategory(slug);

  if (!category) {
    notFound();
  }

  return { category, projects };
});

export default async function CategoryPage(props: { params: Params }) {
  const { slug } = await props.params;

  if (!slug) {
    notFound();
  }

  const { category, projects } = await findCategory(slug);

  if (!projects || !category) {
    notFound();
  }

  return (
    <div className="px-8">
      <Suspense fallback={<CategoryHeaderSkeleton />}>
        <CategoryHeader category={category} />
      </Suspense>

      <section className="pb-24">
        <Suspense fallback={<CategoryContentSkeleton />}>
          <CategoryPageContent projects={projects} />
        </Suspense>
      </section>
    </div>
  );
}
