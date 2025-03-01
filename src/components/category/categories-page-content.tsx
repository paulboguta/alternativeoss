import { Category } from '@/db/types';
import Link from 'next/link';

type CategoryWithCount = Category & {
  count: number;
};

export async function CategoriesPageContent({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 space-x-8 pb-24 md:grid-cols-2 lg:grid-cols-3 lg:space-x-12">
      {categories.map(category => (
        <Link
          prefetch={false}
          href={`/categories/${category.slug}`}
          key={category.slug}
          className="hover:bg-muted/30 flex max-w-[400px] items-center rounded-sm px-2 py-1 text-sm transition-colors"
        >
          <div className="font-medium text-white/90">{category.name}</div>

          <div className="border-muted-foreground/50 mx-2 flex-1 flex-grow border-t" />

          <div className="text-muted-foreground flex w-fit items-center gap-1">
            <p>{category.count}</p>
            <p>{category.count === 1 ? 'Alternative' : 'Alternatives'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
