import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alternative OSS',
  description: 'Open Source Software Alternative Directory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // <Suspense>
    // <ClerkProvider>
    <html lang="en">
      <body
        className={cn('bg-background dark min-h-screen font-sans antialiased', inter.className)}
      >
        <Analytics />
        <Toaster />
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
    //   </ClerkProvider>
    // </Suspense>
  );
}
