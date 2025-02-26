# CDN Image Optimization Guide

This guide explains how to optimize images for the AlternativeOSS CDN to reduce Vercel image transformation usage.

## Optimizing Images for CDN

We use Cloudflare R2 to host our images on the `cdn.alternativeoss.com` subdomain. To optimize images before uploading:

1. Place your source images in a directory
2. Run the optimization script:
   ```bash
   pnpm optimize-images ./path/to/source/images ./path/to/output
   ```
3. Upload the optimized WebP images to Cloudflare R2 manually
4. Ensure proper Cache-Control headers are set: `public, max-age=31536000, immutable`

## Best Practices for CDN Images

1. **Always use WebP format** for the best balance of quality and file size
2. **Set appropriate dimensions** - don't upload images larger than needed
3. **Use descriptive filenames** - typically the project slug for screenshots
4. **Set proper cache headers** - use long cache times (1 year) for static images

## Vercel Image Optimization Reduction

To minimize Vercel image transformation usage:

1. **Use the OptimizedImage component** for all images when possible
2. **Set appropriate image roles** to ensure correct sizing
3. **Use the `unoptimized` prop** for small icons, SVGs, and GIFs
4. **Specify image dimensions** whenever possible
5. **Use WebP format** for all images stored in Cloudflare R2

## Monitoring Usage

Regularly check your Vercel dashboard to monitor image optimization usage. If you're approaching limits:

1. Review image usage in the codebase
2. Consider marking more images as `unoptimized`
3. Ensure all CDN images have proper cache headers
4. Consider using SVG for icons and logos where possible

## Troubleshooting

If you're still experiencing high image optimization usage:

1. Check the Network tab in browser DevTools to see which images are being transformed
2. Verify that cache headers are correctly set on your CDN
3. Ensure the `next.config.ts` settings are correctly applied
4. Consider using the `next/future/image` component for more control 