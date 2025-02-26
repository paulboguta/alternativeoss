import { LicensesDataTable } from '@/components/dev/tables/licenses-data-table';
import { db } from '@/db';
import { licenses } from '@/db/schema';
import Link from 'next/link';
import { Suspense } from 'react';

async function LicensesContent() {
  const data = await db.select().from(licenses);

  return <LicensesDataTable data={data} />;
}

export default async function LicensesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Licenses</h1>
        <p className="text-muted-foreground mt-2">Manage and view all licenses in the database.</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LicensesContent />
      </Suspense>
    </div>
  );
}
