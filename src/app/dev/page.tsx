import Link from "next/link";

export default async function DevPage() {
  return (
    <div className="container py-10 mx-auto">
      <Link href="/" className="text-sm text-muted-foreground">
        Back to Home
      </Link>
      <h1 className="text-4xl font-bold mb-8">Dev Tools</h1>
      <div className="max-w-2xl space-y-4 flex flex-col">
        <Link href="/dev/create-project">Create Project</Link>
        <Link href="/dev/create-alternative">Create Alternative</Link>
      </div>
    </div>
  );
}
