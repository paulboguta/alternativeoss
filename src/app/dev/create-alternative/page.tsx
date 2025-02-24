import { CreateAlternativeForm } from "@/components/dev/create-alternative-form";
import Link from "next/link";

export default function CreateAlternativePage() {
  return (
    <div className="container py-10 mx-auto">
      <Link href="/dev" className="text-sm text-muted-foreground">
        Back to Dev Tools
      </Link>
      <h1 className="text-4xl font-bold mb-8">Create Alternative</h1>
      <div className="max-w-2xl">
        <CreateAlternativeForm />
      </div>
    </div>
  );
}
