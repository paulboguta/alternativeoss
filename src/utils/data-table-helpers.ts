import { alternatives, projects } from '@/db/schema';
import { getFaviconUrl } from '@/lib/favicon';
import { InferSelectModel } from 'drizzle-orm';

type Project = InferSelectModel<typeof projects>;
type Alternative = InferSelectModel<typeof alternatives>;

/**
 * Enhances project data with favicon information for UI display
 * without modifying the database schema (DEV purposes)
 */
export function enhanceProjectsWithFavicons(projects: Project[]) {
  return projects.map(project => ({
    ...project,
    faviconUrl: getFaviconUrl(project.url || ''),
  }));
}

/**
 * Enhances alternative data with favicon information for UI display
 * without modifying the database schema (DEV purposes)
 */
export function enhanceAlternativesWithFavicons(alternatives: Alternative[]) {
  return alternatives.map(alternative => ({
    ...alternative,
    faviconUrl: getFaviconUrl(alternative.url || ''),
  }));
}

/**
 * Type definition for entities enhanced with favicon information
 */
export type WithFavicon<T> = T & {
  faviconUrl: string;
};
