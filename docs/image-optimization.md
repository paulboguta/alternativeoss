# Image Optimization Strategy

This document outlines our approach to optimizing images in the AlternativeOSS project to reduce Vercel image transformation usage.

## Configuration

We've implemented the following optimizations in `next.config.ts`:

1. **Minimum Cache TTL**: Set to 30 days (2592000 seconds) to reduce the number of transformations and revalidation costs.
2. **Device Sizes**: Limited to specific widths: `[640, 750, 828, 1080, 1200, 1920]`.
3. **Image Sizes**: Limited to specific sizes for smaller images: `[16, 32, 48, 64, 96, 128, 256]`.
4. **Quality Settings**: Set WebP quality to 80% for a good balance between quality and file size.
5. **Remote Patterns**: Configured to identify which images should be optimized.

## Components and Utilities

### OptimizedImage Component

We've created a custom `OptimizedImage` component (`src/components/ui/optimized-image.tsx`) that:

- Automatically determines if an image should be optimized based on its type and source
- Sets appropriate `sizes` attribute based on the image's role in the UI
- Uses the `unoptimized` prop for small icons, SVGs, and other images that don't benefit from optimization

### Image Utilities

The `src/utils/image.ts` file contains helper functions:

- `shouldOptimizeImage()`: Determines if an image should be optimized based on its file extension and source
- `getImageSizes()`: Provides appropriate `sizes` attribute values based on the image's role

### Favicon Handling

The `src/lib/favicon.ts` file has been optimized to:

- Use SVG placeholders when no favicon is available
- Provide options to control favicon source preference

## Best Practices

1. **Use the OptimizedImage component** for all images when possible
2. **Set appropriate image roles** to ensure correct sizing
3. **Use the `unoptimized` prop** for:
   - Small icons and favicons
   - SVG images
   - GIF animations
   - Images smaller than 1000 bytes
4. **Specify image dimensions** whenever possible
5. **Use WebP format** for all images stored in Cloudflare R2

## CDN Usage

We use Cloudflare R2 with the `cdn.alternativeoss.com` subdomain to host our images. This setup provides:

1. Edge caching for faster delivery
2. WebP format support for smaller file sizes
3. Proper Cache-Control headers to reduce transformations

## Monitoring

Regularly monitor Vercel image optimization usage in the Vercel dashboard to ensure our optimizations are effective. 