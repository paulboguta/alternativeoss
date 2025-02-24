import { z } from "zod";

export const createAlternativeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  url: z.string().url().optional().or(z.literal("")),
  price: z.number().min(0),
  pricingModel: z.string().optional(),
  isPaid: z.boolean(),
});

export type CreateAlternativeForm = z.infer<typeof createAlternativeFormSchema>;
