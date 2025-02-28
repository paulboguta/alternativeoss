import { websiteConfig } from '@/config/website';
import { env } from '@/env';
import PlausibleProvider from 'next-plausible';

export function Analytics({ children }: { children: React.ReactNode }) {
  if (env.NODE_ENV === 'development') return children;

  return <PlausibleProvider domain={websiteConfig.domain}>{children}</PlausibleProvider>;
}
