'use client';

import { ProjectsDataTable } from '@/components/dev/tables/projects-data-table';
import { Button } from '@/components/ui/button';
import { projects } from '@/db/schema';
import { WithFavicon } from '@/utils/data-table-helpers';
import { InferSelectModel } from 'drizzle-orm';
import { PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateProjectForm } from './create-project-form';

type Project = InferSelectModel<typeof projects>;
type ProjectWithFavicon = WithFavicon<Project>;

interface ProjectsPageClientProps {
  initialData: ProjectWithFavicon[];
}

export function ProjectsPageClient({ initialData }: ProjectsPageClientProps) {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to get the latest data
    router.refresh();
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects List</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'destructive' : 'default'}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <CreateProjectForm onSuccess={handleSuccess} />
        </div>
      )}

      <ProjectsDataTable data={initialData} />
    </div>
  );
}
