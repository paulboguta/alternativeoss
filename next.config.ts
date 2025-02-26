const nextConfig = {
  experimental: {
    useCache: true,
    dynamicIO: true,
    ppr: true,
  },
  images: {
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
};

export default nextConfig;
