import { websiteConfig } from "@/config/website";

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildProjectUrl(project: any) {
  const affiliate = project.affiliateCode?.length
    ? project.affiliateCode
    : `?ref=${websiteConfig.domain}`;

  return project.url + affiliate;
}
