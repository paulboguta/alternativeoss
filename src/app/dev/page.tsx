import Link from 'next/link';

export default async function DevPage() {
  return (
    <div className="py-10">
      <h2 className="mb-6 text-2xl font-semibold">Development Dashboard</h2>
      <p className="text-muted-foreground mb-8">
        Welcome to the development tools dashboard. Use the navigation above to manage different
        aspects of the application.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Projects"
          description="Manage application projects"
          href="/dev/projects"
        />
        <DashboardCard
          title="Alternatives"
          description="Manage alternative applications"
          href="/dev/alternatives"
        />
        <DashboardCard
          title="Categories"
          description="Manage application categories"
          href="/dev/categories"
        />
        <DashboardCard
          title="Licenses"
          description="Manage software licenses"
          href="/dev/licenses"
        />
        <DashboardCard
          title="Project-Alternatives"
          description="Connect projects to alternatives"
          href="/dev/project-alternatives"
        />
        <DashboardCard
          title="Project-Categories"
          description="Connect projects to categories"
          href="/dev/project-categories"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  className,
}: {
  title: string;
  description: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`bg-card block rounded-lg border p-6 shadow-sm transition-all hover:shadow-md ${className || ''}`}
    >
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Link>
  );
}
