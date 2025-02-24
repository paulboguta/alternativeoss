import { CreateProjectForm } from "@/components/dev/create-project-form";
import Link from "next/link";

export default function CreateProjectPage() {
  return (
    <div className="container py-10 mx-auto">
      <Link href="/dev" className="text-sm text-muted-foreground">
        Back to Dev Tools
      </Link>
      <h1 className="text-4xl font-bold mb-8">[DEV] Create Project</h1>
      <CreateProjectForm />
    </div>
  );
}
