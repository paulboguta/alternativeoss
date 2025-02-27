"use server";
import {
  checkIfSubmissionExists,
  createSubmission,
} from "@/data-access/submission";
import { rateLimitByIp } from "@/lib/rate-limiter";
import { submitProjectSchema } from "@/types/submission";
import { checkIfProjectExistsByUrlsUseCase } from "@/use-cases/project";
import { createServerAction } from "zsa";

export const submitProject = createServerAction()
  .input(submitProjectSchema)
  .handler(async ({ input }) => {
    try {
      // Check rate limit
      const { success: rateLimitSuccess } = await rateLimitByIp();
      if (!rateLimitSuccess) {
        return {
          success: false,
          message: "Too many submissions. Please try again later.",
        };
      }

      // Check for existing project in the projects table
      const projectExists = await checkIfProjectExistsByUrlsUseCase(
        input.websiteUrl,
        input.repoLink
      );

      if (projectExists) {
        return {
          success: false,
          message: "This project already exists in our directory.",
        };
      }

      // Check for existing submission in the submissions table
      const submissionExists = await checkIfSubmissionExists(
        input.websiteUrl,
        input.repoLink
      );

      if (submissionExists) {
        return {
          success: false,
          message:
            "This project has already been submitted and is pending review.",
        };
      }

      // Create new submission
      const submission = await createSubmission(input);

      return {
        success: true,
        message: "Project submitted successfully! We'll review it shortly.",
        data: submission,
      };
    } catch (error) {
      console.error("Error submitting project:", error);
      return {
        success: false,
        message: "An error occurred while submitting your project.",
      };
    }
  });
