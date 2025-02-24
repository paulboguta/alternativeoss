import { env } from "@/env";
import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

// This crawl is too expensive for 1.0
const schema = z.object({
  summary: z.string(),
  longDescription: z.string(),
  features: z.array(z.string()),
});

export async function crawlUrl(url: string) {
  const scrapeResult = await firecrawl.scrapeUrl(url, {
    formats: ["json"],
    jsonOptions: { schema: schema },
  });

  if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`);
  }

  return scrapeResult;
}
