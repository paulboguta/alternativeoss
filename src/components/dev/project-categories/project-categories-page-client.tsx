'use client';

import { CreateCategoryForm } from '@/components/dev/categories/create-category-form';
import { ProjectCategoriesManager } from '@/components/dev/project-categories/project-categories-manager';
import { Button } from '@/components/ui/button';
import type { categories, projects } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Project = InferSelectModel<typeof projects>;
type Category = InferSelectModel<typeof categories>;

interface ProjectCategoriesPageClientProps {
  projects: Project[];
  categories: Category[];
  connections: {
    project: Project;
    categories: Category[];
  }[];
}

export function ProjectCategoriesPageClient({
  projects,
  categories,
  connections,
}: ProjectCategoriesPageClientProps) {
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
        <h2 className="text-2xl font-semibold">Connect Projects to Categories</h2>
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
              Add New Category
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <CreateCategoryForm onSuccess={handleSuccess} />
        </div>
      )}

      <ProjectCategoriesManager
        projects={projects}
        categories={categories}
        connections={connections}
      />
    </div>
  );
}
