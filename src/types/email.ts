import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type EmailInput = z.infer<typeof emailSchema>;
