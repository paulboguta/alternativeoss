import Link from 'next/link';

import { Icons } from '@/components/icons';
import { Nav } from '@/components/layout/nav';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-dashed backdrop-blur">
      <div className="container-wrapper px-8">
        <div className="flex h-14 items-center">
          <Nav />
          <div className="flex flex-1 items-center justify-end gap-2">
            {/* // ** COMMAND MENU IN 0.3 ** */}
            {/* <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div> */}
            <nav className="flex items-center gap-0.5">
              <div className="text-muted-foreground bg-muted/40 rounded px-2 py-1 text-xs">
                <div className="flex items-center gap-2">
                  Beta
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
                <Link href={websiteConfig.links.github} target="_blank" rel="noreferrer">
                  <Icons.gitHub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 fill-white px-0">
                <Link href={websiteConfig.links.twitterPawel} target="_blank" rel="noreferrer">
                  <Icons.twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-muted/30 text-bg border-muted hover:bg-muted/50 h-6 border px-2.5 py-1"
              >
                <Link href="/submit" className={cn('hover:text-foreground/80 transition-colors')}>
                  Submit
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
