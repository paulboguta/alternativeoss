import { generateSlug } from '@/utils/slug';
import Link from 'next/link';

type Category = {
  categoryId: number;
  categoryName: string;
  count: number;
};

type ProjectCategoriesProps = {
  categories: Category[];
};

export function ProjectCategories({ categories }: ProjectCategoriesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-bg/60 text-sm font-medium">Categories</h3>
      <div className="flex flex-wrap gap-1.5">
        {categories.map(category => (
          <Link
            prefetch={false}
            key={category.categoryId}
            href={`/categories/${generateSlug(category.categoryName)}`}
            className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 group inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium transition-colors"
          >
            <span>{category.categoryName}</span>
            <span className="bg-background/80 inline-flex items-center rounded px-1 py-0.5 text-[10px] font-medium">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
