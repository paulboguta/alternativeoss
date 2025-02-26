import { env } from '@/env';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DevLayout({ children }: { children: React.ReactNode }) {
  // TODO: remove this once we have a proper auth on prod
  if (env.NODE_ENV !== 'development') {
    redirect('/');
  }

  return (
    <div className="container px-16 py-10">
      <Link href="/" className="text-muted-foreground mb-4 inline-block text-sm">
        Back to Home
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Dev Tools</h1>
      <div className="mb-8 flex flex-wrap gap-4 border-b pb-4">
        <Link href="/dev" className="text-primary font-medium hover:underline">
          Dashboard
        </Link>
        <Link href="/dev/projects" className="text-primary font-medium hover:underline">
          Projects
        </Link>
        <Link href="/dev/alternatives" className="text-primary font-medium hover:underline">
          Alternatives
        </Link>
        <Link href="/dev/categories" className="text-primary font-medium hover:underline">
          Categories
        </Link>
        <Link href="/dev/licenses" className="text-primary font-medium hover:underline">
          Licenses
        </Link>
        <Link href="/dev/project-alternatives" className="text-primary font-medium hover:underline">
          Project-Alternatives
        </Link>
        <Link href="/dev/project-categories" className="text-primary font-medium hover:underline">
          Project-Categories
        </Link>
      </div>
      {children}
    </div>
  );
}
