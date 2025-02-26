import { websiteConfig } from "@/config/website";
import { db } from "@/db";
import { alternatives, categories, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL= "https://" + websiteConfig.domain
  
  const routes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/alternatives`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Get all categories
  const allCategories = await db.select({
    slug: categories.slug,
  }).from(categories);

  const categoryRoutes = allCategories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Get all projects
  const allProjects = await db.select({
    slug: projects.slug,
    updatedAt: projects.updatedAt,
  }).from(projects)
    .where(eq(projects.isLive, true));

  const projectRoutes = allProjects.map((project) => ({
    url: `${BASE_URL}/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Get all alternatives
  const allAlternatives = await db.select({
    slug: alternatives.slug,
    updatedAt: alternatives.updatedAt,
  }).from(alternatives);

  const alternativeRoutes = allAlternatives.map((alternative) => ({
    url: `${BASE_URL}/alternatives/${alternative.slug}`,
    lastModified: alternative.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routes, ...categoryRoutes, ...projectRoutes, ...alternativeRoutes];
} 