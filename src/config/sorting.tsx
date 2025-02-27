import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ } from 'lucide-react';

export type SortField = 'name' | 'repoStars' | 'createdAt' | 'repoLastCommit';
export type SortDirection = 'asc' | 'desc';

export type SortOption = {
  field: SortField;
  direction: SortDirection;
  label: string;
  icon: React.ReactNode;
};

export const sortOptions: SortOption[] = [
  {
    field: 'createdAt',
    direction: 'desc',
    label: 'Newest',
    icon: <ArrowDownAZ className="mr-2 h-4 w-4" />,
  },
  {
    field: 'name',
    direction: 'asc',
    label: 'Name (A-Z)',
    icon: <ArrowDownAZ className="mr-2 h-4 w-4" />,
  },
  {
    field: 'name',
    direction: 'desc',
    label: 'Name (Z-A)',
    icon: <ArrowUpAZ className="mr-2 h-4 w-4" />,
  },
  {
    field: 'repoStars',
    direction: 'desc',
    label: 'Most Stars',
    icon: <ArrowDownWideNarrow className="mr-2 h-4 w-4" />,
  },
  {
    field: 'repoLastCommit',
    direction: 'desc',
    label: 'Recent Commit',
    icon: <ArrowDownWideNarrow className="mr-2 h-4 w-4" />,
  },
];
