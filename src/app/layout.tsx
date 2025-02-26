import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/sonner';
import { metadata } from '@/config/website';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

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
