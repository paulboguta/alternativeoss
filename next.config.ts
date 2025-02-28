import { withPlausibleProxy } from 'next-plausible';

export default withPlausibleProxy()({
  experimental: {
    useCache: true,
    // dynamicIO: true,
    ppr: true,
  },
  images: {
    // Set minimum cache TTL to 30 days to reduce transformations
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/favicon.{ico,png}',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/assets/favicon.{ico,png}',
      },
      {
        protocol: 'https',
        hostname: 'cdn.alternativeoss.com',
        pathname: '/**',
      },
    ],
  },
});
