import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export type CreateSubmission = {
  name: string;
  projectName: string;
  email: string;
  websiteUrl?: string;
  repoLink: string;
  description?: string;
};

export async function checkIfSubmissionExists(
  websiteUrl?: string,
  repoLink?: string
) {
  if (!websiteUrl && !repoLink) return false;

  const existingSubmission = await db
    .select()
    .from(submissions)
    .where(
      or(
        websiteUrl ? eq(submissions.websiteUrl, websiteUrl) : undefined,
        repoLink ? eq(submissions.repoLink, repoLink) : undefined
      )
    )
    .limit(1);

  return existingSubmission.length > 0;
}

export async function createSubmission(data: CreateSubmission) {
  const [submission] = await db
    .insert(submissions)
    .values({
      name: data.name,
      projectName: data.projectName,
      email: data.email,
      websiteUrl: data.websiteUrl,
      repoLink: data.repoLink,
      description: data.description,
    })
    .returning();

  return submission;
}
