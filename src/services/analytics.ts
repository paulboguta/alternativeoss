import { env } from "@/env";
import { OpenPanel } from "@openpanel/nextjs";

export const op = new OpenPanel({
  clientId: env.OPEN_PANEL_CLIENT_ID!,
  clientSecret: env.OPEN_PANEL_SECRET!,
});
