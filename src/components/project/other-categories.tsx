import { generateSlug } from '@/utils/slug';
import Link from 'next/link';

type Category = {
  categoryId: number;
  categoryName: string;
  count: number;
};

type OtherCategoriesProps = {
  categories: Category[];
};

export function OtherCategories({ categories }: OtherCategoriesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-bg/60 text-sm font-medium">Explore other categories</h3>
      <div className="flex flex-col gap-1">
        {categories.map(category => (
          <Link
            prefetch={false}
            key={category.categoryId}
            href={`/categories/${generateSlug(category.categoryName)}`}
            className="hover:bg-accent/50 group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors"
          >
            <span className="group-hover:text-foreground text-muted-foreground text-xs font-medium">
              {category.categoryName}
            </span>
            <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-xs font-medium">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
