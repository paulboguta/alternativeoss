import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type RepositoryLinkProps = {
  repoUrl: string;
};

export function RepositoryLink({ repoUrl }: RepositoryLinkProps) {
  return (
    <Button variant="outline" size="lg" className="w-full" asChild>
      <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
        <Icons.gitHub />
        View Repository
      </Link>
    </Button>
  );
}
