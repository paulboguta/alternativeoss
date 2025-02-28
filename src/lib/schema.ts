import { type RequiredProjectData } from '@/types/project';

// https://schema.org/SoftwareSourceCode
interface JsonLdSoftwareSourceCode {
  '@context': 'https://schema.org';
  '@type': 'SoftwareSourceCode';
  name: string;
  description: string;
  url: string;
  codeRepository?: string | null;
  dateModified?: string;
  dateCreated?: string;
  keywords?: string[];
  license?: string;
  image?: string;
  interactionStatistic?: Array<{
    '@type': 'InteractionCounter';
    interactionType: string;
    userInteractionCount: number;
  }>;
  // Allow additional properties with string, number, boolean, object, or array values
  [key: string]: string | number | boolean | object | unknown[] | null | undefined;
}

// Generic JSON-LD interface
interface JsonLdBase {
  '@context': 'https://schema.org';
  '@type': string;
  name: string;
  description: string;
  url: string;
  [key: string]: string | number | boolean | object | unknown[] | null | undefined;
}

// Extended project type that includes all possible fields we might use
interface ProjectWithLicense extends RequiredProjectData {
  license?: {
    name: string;
    key: string;
  } | null;
  logoUrl?: string;
  repoStars?: number | null;
  repoForks?: number | null;
  repoLastCommit?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Alternative type
interface Alternative {
  id: number;
  name: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  url?: string | null;
  logoUrl?: string | null;
  price?: number | null;
  pricingModel?: string | null;
  isPaid?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  faviconUrl?: string | null;
}

// Category type
interface Category {
  id: number;
  name: string;
  slug: string;
}

/**
 * Generates JSON-LD structured data for a project using Schema.org SoftwareSourceCode schema
 * @param project The project data
 * @returns JSON-LD structured data as a JavaScript object
 */
export function generateProjectJsonLd(
  project: ProjectWithLicense
): JsonLdSoftwareSourceCode | null {
  if (!project) return null;

  // Base structured data
  const jsonLd: JsonLdSoftwareSourceCode = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: project.summary || `${project.name} - Open Source Software`,
    url: `https://alternativeoss.com/${project.slug}`,
    codeRepository: project.repoUrl,
    keywords: project.features || [],
  };

  // Add dates if available
  if (project.updatedAt) {
    jsonLd.dateModified = new Date(project.updatedAt).toISOString();
  }

  if (project.createdAt) {
    jsonLd.dateCreated = new Date(project.createdAt).toISOString();
  }

  // Add license if available
  if (project.license && project.license.name) {
    jsonLd.license = `https://spdx.org/licenses/${project.license.key}.html`;
  }

  // Add repo stats if available
  if (project.repoStars || project.repoForks) {
    jsonLd.interactionStatistic = [];

    if (project.repoStars) {
      jsonLd.interactionStatistic.push({
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: project.repoStars,
      });
    }

    if (project.repoForks) {
      jsonLd.interactionStatistic.push({
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ForkAction',
        userInteractionCount: project.repoForks,
      });
    }
  }

  // Add logo if available
  if (project.faviconUrl) {
    jsonLd.image = project.faviconUrl;
  }

  // Add last commit date if available
  if (project.repoLastCommit) {
    jsonLd.dateModified = new Date(project.repoLastCommit).toISOString();
  }

  // Clean up undefined and null values
  return Object.fromEntries(
    Object.entries(jsonLd).filter(([, value]) => value !== undefined && value !== null)
  ) as JsonLdSoftwareSourceCode;
}

/**
 * Generates JSON-LD structured data for an alternative using Schema.org SoftwareApplication schema
 * @param alternative The alternative data
 * @param projects Optional array of related projects
 * @returns JSON-LD structured data as a JavaScript object
 */
export function generateAlternativeJsonLd(
  alternative: Alternative,
  projects?: Array<{ name: string; slug: string }>
): JsonLdBase | null {
  if (!alternative) return null;

  const jsonLd: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: alternative.name,
    description:
      alternative.description ||
      alternative.summary ||
      `${alternative.name} - Software Alternative`,
    url: `https://alternativeoss.com/alternatives/${alternative.slug}`,
    applicationCategory: 'Software',
    operatingSystem: 'Cross Platform',
  };

  // Add pricing information if available
  if (alternative.isPaid !== undefined) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: alternative.price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    };
  }

  // Add logo if available
  if (alternative.logoUrl) {
    jsonLd.image = alternative.logoUrl;
  } else if (alternative.faviconUrl) {
    jsonLd.image = alternative.faviconUrl;
  }

  // Add related projects as alternatives
  if (projects && projects.length > 0) {
    jsonLd.potentialAction = {
      '@type': 'ViewAction',
      target: projects.map(p => `https://alternativeoss.com/${p.slug}`),
      name: 'View Open Source Alternatives',
    };
  }

  // Clean up undefined and null values
  return Object.fromEntries(
    Object.entries(jsonLd).filter(([, value]) => value !== undefined && value !== null)
  ) as JsonLdBase;
}

/**
 * Generates JSON-LD structured data for a category using Schema.org ItemList schema
 * @param category The category data
 * @param projects Array of projects in the category
 * @returns JSON-LD structured data as a JavaScript object
 */
export function generateCategoryJsonLd(
  category: Category,
  projects: Array<{ name: string; slug: string; summary?: string | null }>
): JsonLdBase | null {
  if (!category) return null;

  const jsonLd: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} Open Source Software`,
    description: `A collection of open source ${category.name.toLowerCase()} software alternatives.`,
    url: `https://alternativeoss.com/categories/${category.slug}`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://alternativeoss.com/${project.slug}`,
      name: project.name,
      description: project.summary || `${project.name} - Open Source Software`,
    })),
  };

  // Clean up undefined and null values
  return Object.fromEntries(
    Object.entries(jsonLd).filter(([, value]) => value !== undefined && value !== null)
  ) as JsonLdBase;
}

/**
 * Generates JSON-LD structured data for the categories list page using Schema.org ItemList schema
 * @param categories Array of categories with count
 * @returns JSON-LD structured data as a JavaScript object
 */
export function generateCategoriesListJsonLd(
  categories: Array<{ id: number; name: string; slug: string; count?: number }>
): JsonLdBase | null {
  if (!categories || categories.length === 0) return null;

  const jsonLd: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Open Source Software Categories',
    description: 'A comprehensive list of open source software categories.',
    url: 'https://alternativeoss.com/categories',
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://alternativeoss.com/categories/${category.slug}`,
      name: `${category.name}${category.count ? ` (${category.count})` : ''}`,
      description: `Open source ${category.name.toLowerCase()} software alternatives.`,
    })),
  };

  // Clean up undefined and null values
  return Object.fromEntries(
    Object.entries(jsonLd).filter(([, value]) => value !== undefined && value !== null)
  ) as JsonLdBase;
}
