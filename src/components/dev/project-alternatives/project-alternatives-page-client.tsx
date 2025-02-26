'use client';

import { CreateAlternativeForm } from '@/components/dev/alternatives/create-alternative-form';
import { ProjectAlternativesManager } from '@/components/dev/project-alternatives/project-alternatives-manager';
import { Button } from '@/components/ui/button';
import { alternatives, projects } from '@/db/schema';
import { WithFavicon } from '@/utils/data-table-helpers';
import { InferSelectModel } from 'drizzle-orm';
import { PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Project = InferSelectModel<typeof projects>;
type Alternative = InferSelectModel<typeof alternatives>;
type ProjectWithFavicon = WithFavicon<Project>;
type AlternativeWithFavicon = WithFavicon<Alternative>;

interface ProjectAlternativesPageClientProps {
  projects: ProjectWithFavicon[];
  alternatives: AlternativeWithFavicon[];
  connections: {
    project: ProjectWithFavicon;
    alternatives: AlternativeWithFavicon[];
  }[];
}

export function ProjectAlternativesPageClient({
  projects,
  alternatives,
  connections,
}: ProjectAlternativesPageClientProps) {
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
        <h2 className="text-2xl font-semibold">Connect Projects to Alternatives</h2>
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
              Add New Alternative
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <CreateAlternativeForm onSuccess={handleSuccess} />
        </div>
      )}

      <ProjectAlternativesManager
        projects={projects}
        alternatives={alternatives}
        connections={connections}
      />
    </div>
  );
}
