import { Toaster } from '@/components/ui/sonner';
import { metadata, websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import PlausibleProvider from 'next-plausible';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn('bg-background dark min-h-screen font-sans antialiased', inter.className)}
      >
        <Toaster />
        <PlausibleProvider domain={websiteConfig.domain}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </PlausibleProvider>
      </body>
    </html>
  );
}
