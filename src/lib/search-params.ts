import {
  createLoader,
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import { startTransition } from 'react';

export const searchParams = {
  page: parseAsInteger.withDefault(1).withOptions({
    shallow: false,
  }),
  q: parseAsString.withDefault('').withOptions({
    shallow: false,
    startTransition,
  }),
  sort: parseAsString.withDefault('createdAt').withOptions({
    shallow: false,
    startTransition,
  }),
  dir: parseAsString.withDefault('desc').withOptions({
    shallow: false,
    startTransition,
  }),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const loadSearchParams = createLoader(searchParams);

export const serialize = createSerializer(searchParams);

// Constants for pagination
export const ITEMS_PER_PAGE = 15;
export function getTotalPages(totalItems: number) {
  return Math.ceil(totalItems / ITEMS_PER_PAGE);
}
