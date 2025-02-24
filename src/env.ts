import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    OPEN_PANEL_CLIENT_ID: z.string().min(1),
    OPEN_PANEL_SECRET: z.string().min(1),
    CLAUDE_API_KEY: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    NODE_ENV: z.enum(["development", "production"]),
    CLERK_SECRET_KEY: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY: z.string().min(1),
    SCREENSHOTONE_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CDN_URL: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPEN_PANEL_CLIENT_ID: process.env.OPEN_PANEL_CLIENT_ID,
    OPEN_PANEL_SECRET: process.env.OPEN_PANEL_SECRET,
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    SCREENSHOTONE_ACCESS_KEY: process.env.SCREENSHOTONE_ACCESS_KEY,
    SCREENSHOTONE_SECRET_KEY: process.env.SCREENSHOTONE_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },
});
