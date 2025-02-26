import { AlternativesPageClient } from '@/components/dev/alternatives/alternatives-page-client';
import { db } from '@/db';
import { alternatives } from '@/db/schema';
import { enhanceAlternativesWithFavicons } from '@/utils/data-table-helpers';
import Link from 'next/link';
import { Suspense } from 'react';

async function AlternativesContent() {
  const data = await db.select().from(alternatives);
  const enhancedData = enhanceAlternativesWithFavicons(data);

  return <AlternativesPageClient initialData={enhancedData} />;
}

export default async function AlternativesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Alternatives</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all alternatives in the database.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <AlternativesContent />
      </Suspense>
    </div>
  );
}
