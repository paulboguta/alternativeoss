import { websiteConfig } from '@/config/website';
import Link from 'next/link';

export async function Footer() {
  //   await connection();
  //   const currentTime = Date.now();
  return (
    <div className="container-wrapper border-t border-dashed p-8">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Built with 💚 by{' '}
          <Link
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:underline"
            href={websiteConfig.links.twitterPawel}
          >
            Pawel Boguta
          </Link>
        </p>
        <p className="text-muted-foreground text-sm">
          {/* &copy; {format(currentTime, 'yyyy')} {websiteConfig.name} */}
        </p>
      </div>
    </div>
  );
}
