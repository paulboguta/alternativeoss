"use server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { z } from "zod";
import { createServerAction } from "zsa";

const submitProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  projectName: z.string().min(2, "Project name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  repoLink: z.string().url("Invalid repository URL"),
  description: z.string().optional(),
});

export const submitProject = createServerAction()
  .input(submitProjectSchema)
  .handler(async ({ input }) => {
    const submission = await db
      .insert(submissions)
      .values({
        name: input.name,
        projectName: input.projectName,
        email: input.email,
        websiteUrl: input.websiteUrl,
        repoLink: input.repoLink,
        description: input.description,
      })
      .returning();

    return {
      success: true,
      message: "Project submitted successfully",
      data: submission[0],
    };
  });
