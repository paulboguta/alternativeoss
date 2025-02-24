import Link from "next/link";

import { websiteConfig } from "@/config/website";
export function Nav() {
  return (
    <div className="mr-4 hidden md:flex ">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        {/* <Command className="h-6 w-6" /> */}
        <span className="hidden font-bold lg:inline-block">
          {websiteConfig.name}
        </span>
        <div className="text-xs text-muted-foreground bg-muted/40 rounded px-2 py-1">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            Beta
          </div>
        </div>
      </Link>
    </div>
  );
}
