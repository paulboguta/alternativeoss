import { cn } from '@/lib/utils';
import { getImageSizes, shouldOptimizeImage } from '@/utils/image';
import Image, { ImageProps } from 'next/image';

type ImageRole = 'thumbnail' | 'hero' | 'avatar' | 'icon' | 'banner';

type OptimizedImageProps = Omit<ImageProps, 'sizes'> & {
  isIcon?: boolean;
  role?: ImageRole;
  alt: string;
};

/**
 * OptimizedImage component that applies optimization settings based on image type
 * - For icons/favicons: Uses unoptimized prop to avoid unnecessary transformations
 * - For regular images: Applies proper sizes and quality settings
 */
export function OptimizedImage({
  isIcon = false,
  role = 'thumbnail',
  className,
  src,
  quality = 80,
  alt,
  ...props
}: OptimizedImageProps) {
  // Determine if this image should be optimized
  const shouldOptimize = !isIcon && shouldOptimizeImage(src?.toString() || '');

  // Get appropriate sizes based on the image role
  const sizes = getImageSizes(role);

  // For small icons and favicons, use unoptimized to avoid transformations
  if (!shouldOptimize) {
    return (
      <Image className={cn(className)} src={src} alt={alt} unoptimized {...props} quality={65} />
    );
  }

  // For regular images, apply proper sizes and quality
  return (
    <Image
      className={cn(className)}
      src={src}
      alt={alt}
      sizes={sizes}
      quality={quality}
      {...props}
    />
  );
}
