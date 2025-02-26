import Link from "next/link";

import { Logo } from "@/components/logo";
import { websiteConfig } from "@/config/website";

export function Nav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center lg:mr-6 group">
        <Logo />
        <span className="font-bold ">{websiteConfig.name}</span>
      </Link>
    </div>
  );
}
