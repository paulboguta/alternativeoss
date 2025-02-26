import { License } from '@/types/license';
import { format } from 'date-fns';
import { Clock7, GitFork, Scale, Star } from 'lucide-react';

type ProjectStatsProps = {
  stars: number;
  forks: number;
  lastCommit: Date;
  license?: License | null;
};

export function ProjectStats({ stars, forks, lastCommit, license }: ProjectStatsProps) {
  return (
    <div className="bg-card/50 rounded-lg border px-6 py-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{stars.toLocaleString()}</span>
          <span className="text-muted-foreground text-xs">stars</span>
        </div>
        <div className="flex items-center gap-2">
          <GitFork className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{forks.toLocaleString()}</span>
          <span className="text-muted-foreground text-xs">forks</span>
        </div>
        {license && license.name !== 'other' && (
          <div className="flex items-center gap-2">
            <Scale className="text-muted-foreground h-4 w-4" />
            <span className="font-medium uppercase">{license.name}</span>
            <span className="text-muted-foreground text-xs">license</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock7 className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-xs">
            Last commit {format(lastCommit, 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
}
