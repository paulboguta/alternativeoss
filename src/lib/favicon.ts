/**
 * Extracts the domain from a URL string
 */
function extractDomain(url: string): string {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname;
  } catch {
    return url;
  }
}

/**
 * Returns an array of possible favicon URLs for a given website URL
 * in order of preference (highest quality first)
 */
function getFaviconCandidates(url: string): string[] {
  const domain = extractDomain(url);

  return [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://${domain}/favicon.ico`,
    `https://${domain}/favicon.png`,
    `https://${domain}/assets/favicon.ico`,
    `https://${domain}/assets/favicon.png`,
  ];
}

/**
 * Gets the favicon URL for a website with fallback options
 */
export function getFaviconUrl(url: string): string {
  if (!url) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23e2e8f0'/%3E%3C/svg%3E";
  }

  return getFaviconCandidates(url)[0] || "";
}
