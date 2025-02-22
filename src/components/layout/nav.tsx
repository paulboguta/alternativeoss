"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Command } from "lucide-react";
export function Nav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex ">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Command className="h-6 w-6" />
        {/* <span className="hidden font-bold lg:inline-block">
          {websiteConfig.name}
        </span> */}
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {/* <Link
          href="/categories"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/categories")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Categories
        </Link> */}
      </nav>
    </div>
  );
}
