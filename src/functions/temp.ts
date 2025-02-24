import { generateScreenshot } from "@/lib/image";

import { inngest } from "@/services/inngest";

export const temp = inngest.createFunction(
  { id: "temp" },
  { event: "temp" },
  async ({ step, event }) => {
    await step.run("generate-screenshot", async () => {
      try {
        const data = await generateScreenshot(event.data.url, event.data.slug);
        console.log(data);
        console.log("test");
      } catch (error) {
        console.error(error);
      }
    });
  }
);
