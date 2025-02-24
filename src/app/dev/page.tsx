import { CreateProjectForm } from "@/components/dev/create-project-form";

export default async function DevPage() {
  return (
    <div className="container py-10 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Dev Tools</h1>
      <div className="max-w-2xl">
        <CreateProjectForm />
      </div>
    </div>
  );
}
