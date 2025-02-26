'use client';

import { AlternativesDataTable } from '@/components/dev/tables/alternatives-data-table';
import { Button } from '@/components/ui/button';
import { alternatives } from '@/db/schema';
import { WithFavicon } from '@/utils/data-table-helpers';
import { InferSelectModel } from 'drizzle-orm';
import { PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateAlternativeForm } from './create-alternative-form';

type Alternative = InferSelectModel<typeof alternatives>;
type AlternativeWithFavicon = WithFavicon<Alternative>;

interface AlternativesPageClientProps {
  initialData: AlternativeWithFavicon[];
}

export function AlternativesPageClient({ initialData }: AlternativesPageClientProps) {
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
        <h2 className="text-2xl font-semibold">Alternatives List</h2>
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
              Add Alternative
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <CreateAlternativeForm onSuccess={handleSuccess} />
        </div>
      )}

      <AlternativesDataTable data={initialData} />
    </div>
  );
}
