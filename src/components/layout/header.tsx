import Link from "next/link";

import { Icons } from "@/components/icons";
import { Nav } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { websiteConfig } from "@/config/website";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container-wrapper px-8">
        <div className="flex h-14 items-center">
          <Nav />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end ">
            {/* // ** SEARCH IN 0.3 ** */}
            {/* <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu /  >
            </div> */}
            <nav className="flex items-center gap-0.5">
              {/* // ** OPEN SOURCE REPO IN 1.0 */}
              {/*
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0"
              >
                 <Link
                  href={websiteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
               */}

              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 px-0 fill-white"
              >
                <Link
                  href={websiteConfig.links.twitterPawel}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="px-2.5 py-1 h-6 bg-muted/30 text-bg border border-muted hover:bg-muted/50"
              >
                <Link
                  href="/submit"
                  className={cn("transition-colors hover:text-foreground/80")}
                >
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
