/**
 * Determines if an image should be optimized based on its file extension
 * @param src The image source URL
 * @returns Boolean indicating if the image should be optimized
 */
export function shouldOptimizeImage(src: string): boolean {
  if (!src) return false;

  // Don't optimize SVGs, GIFs, or data URLs
  if (src.endsWith('.svg') || src.endsWith('.gif') || src.startsWith('data:')) {
    return false;
  }

  // Don't optimize favicons from Google or small icons
  if (
    src.includes('google.com/s2/favicons') ||
    src.includes('favicon.ico') ||
    src.includes('favicon.png')
  ) {
    return false;
  }

  return true;
}

/**
 * Determines appropriate image sizes attribute based on the image's role
 * @param role The role of the image in the UI
 * @returns The sizes attribute string
 */
export function getImageSizes(
  role: 'thumbnail' | 'hero' | 'avatar' | 'icon' | 'banner' = 'thumbnail'
): string {
  switch (role) {
    case 'hero':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px';
    case 'banner':
      return '100vw';
    case 'thumbnail':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px';
    case 'avatar':
      return '64px';
    case 'icon':
      return '32px';
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';
  }
}
