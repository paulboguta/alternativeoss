import {
  connectProjectCategoryAction,
  disconnectProjectCategoryAction,
} from '@/app/dev/project-categories/actions';
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
import type { categories, projects } from '@/db/schema';
import { WithFavicon } from '@/utils/data-table-helpers';
import { InferSelectModel } from 'drizzle-orm';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Project = InferSelectModel<typeof projects>;
type Category = InferSelectModel<typeof categories>;
type ProjectWithFavicon = WithFavicon<Project>;

interface ProjectCategoriesManagerProps {
  projects: ProjectWithFavicon[];
  categories: Category[];
  connections: {
    project: ProjectWithFavicon;
    categories: Category[];
  }[];
}

export function ProjectCategoriesManager({
  projects,
  categories,
  connections,
}: ProjectCategoriesManagerProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const selectedProject = projects.find(project => project.id.toString() === selectedProjectId);

  const selectedProjectConnections = connections.find(
    connection => connection.project.id.toString() === selectedProjectId
  );

  const availableCategories = categories.filter(
    category => !selectedProjectConnections?.categories.some(conn => conn.id === category.id)
  );

  const handleConnect = async () => {
    if (!selectedProjectId || !selectedCategoryId) {
      toast.error('Please select both a project and a category');
      return;
    }

    try {
      await connectProjectCategoryAction({
        projectId: parseInt(selectedProjectId),
        categoryId: parseInt(selectedCategoryId),
      });

      toast.success('Connected successfully');
      // Reset category selection
      setSelectedCategoryId('');
    } catch (error) {
      toast.error('Failed to connect');
      console.error(error);
    }
  };

  const handleDisconnect = async (projectId: number, categoryId: number) => {
    try {
      await disconnectProjectCategoryAction({
        projectId,
        categoryId,
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
          <CardTitle>Connect Projects to Categories</CardTitle>
          <CardDescription>Select a project and a category to connect them</CardDescription>
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
                              isIcon={true}
                              src={project.faviconUrl}
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
                  Category
                </label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                  disabled={!selectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleConnect} disabled={!selectedProjectId || !selectedCategoryId}>
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
                    isIcon={true}
                    src={selectedProject.faviconUrl}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {selectedProject.name} Categories
              </div>
            </CardTitle>
            <CardDescription>Manage categories for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProjectConnections?.categories.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProjectConnections.categories.map(category => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {category.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 rounded-full p-0"
                        onClick={() => handleDisconnect(selectedProject.id, category.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No categories connected to this project yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
