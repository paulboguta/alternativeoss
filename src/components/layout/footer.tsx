import { websiteConfig } from '@/config/website';
import Link from 'next/link';

const featuredOn = [
  {
    name: 'Startup Fame',
    href: 'https://startupfa.me/s/alternativeoss?utm_source=alternativeoss.com',
  },
];

export async function Footer() {
  return (
    <div className="container-wrapper space-y-4 border-y border-dashed">
      <div className="flex flex-col items-start gap-4 border-b px-8 py-4 md:flex-row md:items-center md:justify-between md:gap-0">
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
        {/* badges / links where the project was featured */}
        <div className="text-muted-foreground space-x-2 text-xs">
          <span>Featured on</span>
          {featuredOn.map(item => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="text-muted-foreground hover:underline"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
