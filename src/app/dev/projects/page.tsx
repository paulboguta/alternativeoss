import { ProjectsPageClient } from '@/components/dev/projects/projects-page-client';
import { db } from '@/db';
import { projects } from '@/db/schema';
import Link from 'next/link';
import { Suspense } from 'react';

async function ProjectsContent() {
  const data = await db.select().from(projects);

  return <ProjectsPageClient initialData={data} />;
}

export default async function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href="/dev" className="text-muted-foreground text-sm">
          Back to Dev Tools
        </Link>
        <h1 className="mt-2 text-4xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-2">Manage and view all projects in the database.</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
