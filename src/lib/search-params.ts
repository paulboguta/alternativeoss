import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(''),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

// Constants for pagination
export const ITEMS_PER_PAGE = 15;
export function getTotalPages(totalItems: number) {
  return Math.ceil(totalItems / ITEMS_PER_PAGE);
}
