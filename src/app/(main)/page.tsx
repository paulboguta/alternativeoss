import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGitHubStats } from "@/services/github";

const MOCK_DESCRIPTION =
  "An open-source alternative that provides enterprise-grade features, robust security, and seamless integration capabilities. Built with modern technologies and designed for scalability, it offers a comprehensive solution for teams of all sizes.";

export const mockProjects = [
  {
    id: 1,
    name: "Cal.com",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Cal.com is an open-source scheduling infrastructure platform that serves as a self-hosted Calendly alternative, giving users complete control over their scheduling data, workflow, and appearance while enabling white-label customization.",
    url: "https://cal.com",
    logoUrl: "https://cal.com/logo.png",
    license: "MIT",
    createdAt: new Date("2021-01-15T00:00:00Z"),
    updatedAt: new Date("2025-02-01T00:00:00Z"),
    repoUrl: "https://github.com/lensapp/lens",
    repoStars: 8500,
    repoForks: 1200,
    repoLastCommit: new Date("2025-01-28T00:00:00Z"),
    repoCreatedAt: new Date("2020-06-15T00:00:00Z"),
    isClaimed: false,
    features: [
      "Complete data ownership with self-hosted or managed hosting options",
      "White-label customization and ability to deploy on custom domains",
      "API-driven architecture for flexible integration",
      "Multiple calendar integration support (Google, Outlook, etc.)",
      "Team scheduling and collaboration features",
      "Customizable booking workflows and automation",
      "Video meeting integration (Zoom, Daily.co, etc.)",
      "Email and SMS notifications for bookings",
      "Multi-language support with translations",
      "Enterprise features including SSO and admin panel",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
  {
    id: 2,
    name: "Gitpod",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Gitpod is an open-source development platform that provides automated, ready-to-code development environments in the browser. It serves as a self-hosted alternative to cloud IDEs, enabling teams to maintain complete control over their development infrastructure while offering a seamless coding experience.",
    url: "https://www.gitpod.io",
    logoUrl: "https://www.gitpod.io/logo.svg",
    license: "Apache-2.0",
    createdAt: new Date("2020-02-10T00:00:00Z"),
    updatedAt: new Date("2025-01-20T00:00:00Z"),
    repoUrl: "https://github.com/gitpod-io/gitpod",
    repoStars: 6000,
    repoForks: 800,
    repoLastCommit: new Date("2025-01-25T00:00:00Z"),
    repoCreatedAt: new Date("2019-12-01T00:00:00Z"),
    isClaimed: false,
    features: [
      "Browser-based development environments",
      "Pre-configured workspace templates",
      "Git repository integration",
      "VS Code extension compatibility",
      "Docker container customization",
      "Collaborative development features",
      "Workspace snapshots and sharing",
      "Integrated terminal and debugging",
      "Custom development environment configs",
      "Resource usage monitoring and limits",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
  {
    id: 3,
    name: "Focalboard",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Focalboard is an open-source project management tool that serves as a self-hosted alternative to Trello and Notion. It provides a flexible platform for organizing work and projects, offering complete control over data and customization while enabling teams to collaborate effectively.",
    url: "https://www.focalboard.com",
    logoUrl: "https://www.focalboard.com/logo.png",
    license: "MIT",
    createdAt: new Date("2021-03-10T00:00:00Z"),
    updatedAt: new Date("2025-02-05T00:00:00Z"),
    repoUrl: "https://github.com/mattermost/focalboard",
    repoStars: 4000,
    repoForks: 600,
    repoLastCommit: new Date("2025-01-30T00:00:00Z"),
    repoCreatedAt: new Date("2021-02-20T00:00:00Z"),
    isClaimed: false,
    features: [
      "Customizable board views (Kanban, table, gallery)",
      "Task and project tracking",
      "Team collaboration tools",
      "Custom property and field support",
      "Template creation and sharing",
      "File attachment capabilities",
      "Search and filtering options",
      "Mobile-responsive interface",
      "Data export and backup",
      "Integration with Mattermost",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
  {
    id: 4,
    name: "Jitsi Meet",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Jitsi Meet is an open-source video conferencing platform that provides a secure, flexible alternative to commercial solutions like Zoom. It offers enterprise-grade video conferencing capabilities with complete control over data and infrastructure, enabling organizations to host their own video conferencing solution.",
    url: "https://jitsi.org/jitsi-meet/",
    logoUrl: "https://jitsi.org/logo.png",
    license: "Apache-2.0",
    createdAt: new Date("2018-05-15T00:00:00Z"),
    updatedAt: new Date("2025-02-03T00:00:00Z"),
    repoUrl: "https://github.com/jitsi/jitsi-meet",
    repoStars: 23000,
    repoForks: 4000,
    repoLastCommit: new Date("2025-01-31T00:00:00Z"),
    repoCreatedAt: new Date("2018-04-20T00:00:00Z"),
    isClaimed: false,
    features: [
      "HD video conferencing",
      "End-to-end encryption",
      "Screen sharing and recording",
      "Chat and file sharing",
      "Custom branding options",
      "Mobile and desktop apps",
      "WebRTC-based architecture",
      "Meeting room controls",
      "Live streaming integration",
      "Low-latency communication",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
  {
    id: 5,
    name: "Mattermost",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Mattermost is an open-source team collaboration platform that serves as a self-hosted alternative to Slack. It provides enterprise-grade messaging and collaboration features while giving organizations complete control over their communication data and security requirements.",
    url: "https://jitsi.org/jitsi-meet/",
    logoUrl: "https://mattermost.com/logo.png",
    license: "GPL-3.0",
    createdAt: new Date("2017-11-05T00:00:00Z"),
    updatedAt: new Date("2025-02-04T00:00:00Z"),
    repoUrl: "https://github.com/mattermost/mattermost-server",
    repoStars: 18000,
    repoForks: 3500,
    repoLastCommit: new Date("2025-01-29T00:00:00Z"),
    repoCreatedAt: new Date("2017-10-10T00:00:00Z"),
    isClaimed: false,
    features: [
      "Real-time messaging and file sharing",
      "Channel-based communication",
      "Custom integration support",
      "Advanced search capabilities",
      "Role-based access control",
      "Compliance and audit tools",
      "Mobile and desktop apps",
      "Custom emoji and reactions",
      "Thread discussions",
      "Enterprise security features",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
  {
    id: 6,
    name: "Gitea",
    summary: MOCK_DESCRIPTION,
    longDescription:
      "Gitea is a lightweight, self-hosted Git service that provides an alternative to GitHub and GitLab. It offers a complete suite of repository management features while being resource-efficient and easy to install, giving organizations full control over their source code infrastructure.",
    url: "https://gitea.io",
    logoUrl: "https://gitea.io/images/logo.svg",
    license: "MIT",
    createdAt: new Date("2016-08-20T00:00:00Z"),
    updatedAt: new Date("2025-02-02T00:00:00Z"),
    repoUrl: "https://github.com/go-gitea/gitea",
    repoStars: 30000,
    repoForks: 5000,
    repoLastCommit: new Date("2025-01-27T00:00:00Z"),
    repoCreatedAt: new Date("2016-08-15T00:00:00Z"),
    isClaimed: false,
    features: [
      "Git repository management",
      "Issue tracking and milestones",
      "Pull request workflow",
      "Wiki and documentation",
      "Organization and team management",
      "Webhook and API integration",
      "Activity timeline",
      "Repository mirroring",
      "CI/CD pipeline integration",
      "Package registry support",
    ],
    affiliateCode: null,
    isFeatured: false,
    featureEndAt: null,
  },
];

export default async function HomePage() {
  const repoStats = await getGitHubStats("https://github.com/calcom/cal.com");

  console.log(repoStats);

  return (
    <div className=" px-8">
      <section className="mx-auto flex flex-col gap-3 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight">
          Discover Open Source Software
        </h1>
        <p className="max-w-[550px] text-lg text-muted-foreground font-light leading-tight">
          Find and compare the best open source alternatives to popular software
          tools. Join our community of 3300+ creators.
        </p>
        <div className="mt-3 flex w-full max-w-sm space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-9 focus-visible:ring-1"
          />
          <Button type="submit" className="h-9">
            Subscribe
          </Button>
        </div>
      </section>

      <section className="pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              summary={project.summary!}
              url={project.url!}
              repoStars={project.repoStars!}
              license={project.license}
              repoLastCommit={project.repoLastCommit!}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
