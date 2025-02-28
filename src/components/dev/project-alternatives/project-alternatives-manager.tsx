import {
  connectProjectAlternativeAction,
  disconnectProjectAlternativeAction,
} from '@/app/dev/project-alternatives/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { alternatives, projects } from '@/db/schema';
import { SVG_PLACEHOLDER } from '@/lib/favicon';
import { InferSelectModel } from 'drizzle-orm';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Project = InferSelectModel<typeof projects>;
type Alternative = InferSelectModel<typeof alternatives>;

interface ProjectAlternativesManagerProps {
  projects: Project[];
  alternatives: Alternative[];
  connections: {
    project: Project;
    alternatives: Alternative[];
  }[];
}

export function ProjectAlternativesManager({
  projects,
  alternatives,
  connections,
}: ProjectAlternativesManagerProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string>('');

  const selectedProject = projects.find(project => project.id.toString() === selectedProjectId);

  const selectedProjectConnections = connections.find(
    connection => connection.project.id.toString() === selectedProjectId
  );

  const availableAlternatives = alternatives.filter(
    alternative =>
      !selectedProjectConnections?.alternatives.some(conn => conn.id === alternative.id)
  );

  const handleConnect = async () => {
    if (!selectedProjectId || !selectedAlternativeId) {
      toast.error('Please select both a project and an alternative');
      return;
    }

    try {
      await connectProjectAlternativeAction({
        projectId: parseInt(selectedProjectId),
        alternativeId: parseInt(selectedAlternativeId),
      });

      toast.success('Connected successfully');
      // Reset alternative selection
      setSelectedAlternativeId('');
    } catch (error) {
      toast.error('Failed to connect');
      console.error(error);
    }
  };

  const handleDisconnect = async (projectId: number, alternativeId: number) => {
    try {
      await disconnectProjectAlternativeAction({
        projectId,
        alternativeId,
      });

      toast.success('Disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Projects to Alternatives</CardTitle>
          <CardDescription>Select a project and an alternative to connect them</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Project
                </label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="relative h-4 w-4 overflow-hidden rounded-sm">
                            <OptimizedImage
                              isIcon
                              src={project.faviconUrl ?? SVG_PLACEHOLDER}
                              alt=""
                              fill
                              className="object-contain"
                            />
                          </div>
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Alternative
                </label>
                <Select
                  value={selectedAlternativeId}
                  onValueChange={setSelectedAlternativeId}
                  disabled={!selectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an alternative" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAlternatives.map(alternative => (
                      <SelectItem key={alternative.id} value={alternative.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="relative h-4 w-4 overflow-hidden rounded-sm">
                            <OptimizedImage
                              isIcon
                              src={alternative.faviconUrl ?? SVG_PLACEHOLDER}
                              alt=""
                              fill
                              className="object-contain"
                            />
                          </div>
                          {alternative.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleConnect} disabled={!selectedProjectId || !selectedAlternativeId}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative h-5 w-5 overflow-hidden rounded-sm">
                  <OptimizedImage
                    isIcon
                    src={selectedProject.faviconUrl ?? SVG_PLACEHOLDER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {selectedProject.name} Alternatives
              </div>
            </CardTitle>
            <CardDescription>Manage alternatives for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProjectConnections?.alternatives.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProjectConnections.alternatives.map(alternative => (
                    <Badge
                      key={alternative.id}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <div className="relative mr-1 h-4 w-4 overflow-hidden rounded-sm">
                        <OptimizedImage
                          isIcon
                          src={alternative.faviconUrl ?? SVG_PLACEHOLDER}
                          alt=""
                          fill
                          className="object-contain"
                        />
                      </div>
                      {alternative.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 rounded-full p-0"
                        onClick={() => handleDisconnect(selectedProject.id, alternative.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No alternatives connected to this project yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
