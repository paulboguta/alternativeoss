import Link from 'next/link';

import { Logo } from '@/components/logo';
import { websiteConfig } from '@/config/website';

export function Nav() {
  return (
    <div className="mr-4">
      <Link href="/" className="group mr-4 flex items-center lg:mr-6">
        <Logo />
        <span className="hidden font-bold md:block">{websiteConfig.name}</span>
      </Link>
    </div>
  );
}
