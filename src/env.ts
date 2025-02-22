import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_PANEL_CLIENT_ID: z.string().min(1),
    OPEN_PANEL_SECRET: z.string().min(1),
    CLAUDE_API_KEY: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_PANEL_CLIENT_ID: process.env.OPEN_PANEL_CLIENT_ID,
    OPEN_PANEL_SECRET: process.env.OPEN_PANEL_SECRET,
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
});
