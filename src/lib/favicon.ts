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

// SVG placeholder for when no favicon is available
const SVG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23e2e8f0'/%3E%3C/svg%3E";

/**
 * Gets the favicon URL for a website with fallback options
 * @param url The website URL
 * @param preferGoogle Whether to prefer Google's favicon service (default: true)
 * @returns The favicon URL or a placeholder SVG
 */
export function getFaviconUrl(url: string, preferGoogle = true): string {
  if (!url) {
    return SVG_PLACEHOLDER;
  }

  const candidates = getFaviconCandidates(url);

  // If we don't want to prefer Google's service, move it to the end
  if (!preferGoogle && candidates.length > 1) {
    const googleCandidate = candidates.shift();
    if (googleCandidate) {
      candidates.push(googleCandidate);
    }
  }

  return candidates[0] || SVG_PLACEHOLDER;
}
