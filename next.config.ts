const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons/**",
      },
      // Allow direct favicon URLs from any domain
      {
        protocol: "https",
        hostname: "**",
        pathname: "/favicon.{ico,png}",
      },
      // Allow favicon in assets directory
      {
        protocol: "https",
        hostname: "**",
        pathname: "/assets/favicon.{ico,png}",
      },
    ],
  },
};

export default nextConfig;
