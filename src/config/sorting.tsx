import {
  AlternativeSortField,
  CommonSortField,
  ProjectSortField,
  SortOption,
} from '@/types/sorting';
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ } from 'lucide-react';

export const DEFAULT_SORT_PROJECTS: SortOption<ProjectSortField> = {
  field: 'createdAt',
  direction: 'desc',
  label: 'Newest',
  icon: <ArrowDownAZ className="mr-2 h-4 w-4" />,
};

export const DEFAULT_SORT_ALTERNATIVES: SortOption<AlternativeSortField> = {
  field: 'projectCount',
  direction: 'desc',
  label: 'Most Popular',
  icon: <ArrowDownWideNarrow className="mr-2 h-4 w-4" />,
};

const COMMON_SORT_OPTIONS: SortOption<CommonSortField>[] = [
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
    icon: <ArrowUpAZ className="mr-2 h-4 w-4" />,
  },
  {
    field: 'name',
    direction: 'desc',
    label: 'Name (Z-A)',
    icon: <ArrowDownAZ className="mr-2 h-4 w-4" />,
  },
];

export const ALTERNATIVES_SORT_OPTIONS: SortOption<AlternativeSortField>[] = [
  ...(COMMON_SORT_OPTIONS as SortOption<AlternativeSortField>[]),
  {
    field: 'projectCount',
    direction: 'desc',
    label: 'Most Popular',
    icon: <ArrowDownWideNarrow className="mr-2 h-4 w-4" />,
  },
];

export const PROJECTS_SORT_OPTIONS: SortOption<ProjectSortField>[] = [
  ...(COMMON_SORT_OPTIONS as SortOption<ProjectSortField>[]),
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
