import { CategoriesDataTable } from '@/components/dev/tables/categories-data-table';
import { db } from '@/db';
import { categories } from '@/db/schema';
import Link from 'next/link';
import { Suspense } from 'react';

async function CategoriesContent() {
  const data = await db.select().from(categories);

  return <CategoriesDataTable data={data} />;
}

export default async function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all categories in the database.
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
