import { generateAlternativeSummary } from '@/ai/alternatives';
import { extractJsonFromResponse } from '@/ai/core';
import { DEFAULT_SORT_ALTERNATIVES } from '@/config/sorting';
import { createAlternative, getAlternatives } from '@/data-access/alternative';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from 'next/cache';

export const createAlternativeUseCase = async ({
  name,
  url,
  slug,
  faviconUrl,
}: {
  name: string;
  url: string;
  slug: string;
  faviconUrl: string;
}) => {
  try {
    const summary = await generateAlternativeSummary(name);

    const summaryResult = typeof summary === 'string' ? extractJsonFromResponse(summary) : summary;

    const alternative = await createAlternative({
      name,
      url,
      slug,
      faviconUrl,
      summary: String(summaryResult?.summary),
    });
    revalidateTag('alternatives');

    return alternative;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAlternativesUseCase = async ({
  searchQuery = '',
  page = 1,
  limit = 10,
  sortField = DEFAULT_SORT_ALTERNATIVES.field,
  sortDirection = DEFAULT_SORT_ALTERNATIVES.direction,
  filters = {},
}: {
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  filters?: Record<string, unknown>;
}) => {
  'use cache';

  cacheTag('alternatives');
  cacheLife('max');

  const performanceCheck = performance.now();

  const { alternatives: alternativesResult, pagination } = await getAlternatives({
    searchQuery,
    page,
    limit,
    sortField,
    sortDirection,
    // TODO: Apply filters when implemented
    //   filters,
  });

  console.log(`Alternatives fetched in ${performance.now() - performanceCheck}ms`);
  console.log(
    `Additional parameters: ${JSON.stringify({
      searchQuery,
      page,
      limit,
      sortField,
      sortDirection,
      filters,
    })}`
  );
  return {
    alternatives: alternativesResult,
    pagination,
    sorting: {
      field: sortField,
      direction: sortDirection,
    },
  };
};
