import { EditProjectForm } from '@/components/dev/projects/edit-project-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const projectResults = await db.select().from(projects).where(eq(projects.slug, slug));

  if (!projectResults.length) {
    notFound();
  }

  const project = projectResults[0];

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Project Admin: {project.name}</h1>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit Project</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <EditProjectForm
            project={{
              id: project.id,
              name: project.name,
              slug: project.slug,
              summary: project.summary,
              longDescription: project.longDescription,
              features: project.features,
              url: project.url,
              repoUrl: project.repoUrl,
              affiliateCode: project.affiliateCode,
              isFeatured: project.isFeatured || false,
              isLive: project.isLive || false,
              isScheduled: project.isScheduled || false,
              scheduledAt: project.scheduledAt,
            }}
          />
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>Basic information about the project</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID</dt>
                    <dd className="mt-1 text-sm">{project.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm">{project.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Slug</dt>
                    <dd className="mt-1 text-sm">{project.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">URL</dt>
                    <dd className="mt-1 text-sm">{project.url || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Repository URL</dt>
                    <dd className="mt-1 text-sm">{project.repoUrl || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Affiliate Code</dt>
                    <dd className="mt-1 text-sm">{project.affiliateCode || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Featured</dt>
                    <dd className="mt-1 text-sm">{project.isFeatured ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Live</dt>
                    <dd className="mt-1 text-sm">{project.isLive ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Scheduled</dt>
                    <dd className="mt-1 text-sm">{project.isScheduled ? 'Yes' : 'No'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Scheduled At</dt>
                    <dd className="mt-1 text-sm">
                      {project.scheduledAt ? new Date(project.scheduledAt).toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm">
                      {project.createdAt ? new Date(project.createdAt).toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                    <dd className="mt-1 text-sm">
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Content</CardTitle>
                <CardDescription>Content and descriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Summary</h3>
                    <p className="mt-2 text-sm whitespace-pre-wrap">
                      {project.summary || 'No summary available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Long Description</h3>
                    <p className="mt-2 text-sm whitespace-pre-wrap">
                      {project.longDescription || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Features</h3>
                    {project.features && project.features.length > 0 ? (
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {project.features.map((feature, index) => (
                          <li key={index} className="text-sm">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm">No features listed</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
