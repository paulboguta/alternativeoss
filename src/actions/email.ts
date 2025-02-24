"use server";

import { db } from "@/db";
import { emails } from "@/db/schema";
import { unauthenticatedAction } from "@/lib/safe-action";
import { emailSchema } from "@/types/email";
import { eq } from "drizzle-orm";

export const subscribeToNewsletter = unauthenticatedAction
  .createServerAction()
  .input(emailSchema)
  .handler(async ({ input }) => {
    try {
      const existingEmail = await db
        .select()
        .from(emails)
        .where(eq(emails.email, input.email))
        .limit(1);

      if (existingEmail.length > 0) {
        return {
          success: false,
          message: "This email is already subscribed",
        };
      }

      await db.insert(emails).values({
        email: input.email,
      });

      return {
        success: true,
        message: "Successfully subscribed! Thank you! 💜",
      };
    } catch {
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  });
