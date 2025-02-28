import { alternatives, projects } from '@/db/schema';
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
  }));
}

/**
 * Enhances alternative data with favicon information for UI display
 * without modifying the database schema (DEV purposes)
 */
export function enhanceAlternativesWithFavicons(alternatives: Alternative[]) {
  return alternatives.map(alternative => ({
    ...alternative,
  }));
}

/**
 * Type definition for entities enhanced with favicon information
 */
export type WithFavicon<T> = T & {
  faviconUrl: string;
};
