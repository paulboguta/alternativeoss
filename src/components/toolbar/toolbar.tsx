import { AD_PLACEMENT } from '@/config/ads';
import { SortOption } from '@/types/sorting';
import { AdSpot3 } from '../ads/ad-spot-3';
import { Search } from './search';
import { Sorting } from './sorting';

export async function Toolbar<T extends string>({
  sortOptions,
  defaultSort,
  searchPlaceholder,
}: {
  sortOptions: SortOption<T>[];
  defaultSort: SortOption<T>;
  searchPlaceholder: string;
}) {
  return (
    <div className="bg-background sticky top-14 z-10 mb-6 flex w-full flex-col items-start justify-start gap-4 border-y border-dashed px-8 py-4 sm:flex-row sm:items-center">
      <Search searchPlaceholder={searchPlaceholder} />
      <Sorting defaultSort={defaultSort} sortOptions={sortOptions} />
      {/* only for desktop now */}
      <div className="hidden md:ml-auto md:flex md:gap-2">
        <AdSpot3
          adMetadata={{
            placement: 'toolbar',
            adName: AD_PLACEMENT.name,
            adVersion: AD_PLACEMENT.version,
          }}
        />
        <AdSpot3
          adMetadata={{
            placement: 'toolbar',
            adName: AD_PLACEMENT.name,
            adVersion: AD_PLACEMENT.version,
          }}
        />
      </div>
    </div>
  );
}
