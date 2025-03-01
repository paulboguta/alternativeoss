export type CommonSortField = 'createdAt' | 'name';
export type ProjectSortField = CommonSortField | 'repoStars' | 'repoLastCommit';
export type AlternativeSortField = CommonSortField | 'projectCount';

export type SortDirection = 'asc' | 'desc';

export type SortOption<T extends string> = {
  field: T;
  direction: SortDirection;
  label: string;
  icon: React.ReactNode;
};
