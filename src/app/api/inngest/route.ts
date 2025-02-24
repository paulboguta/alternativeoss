import { handleProjectCreated } from "@/functions/project-created";
import { inngest } from "@/services/inngest";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleProjectCreated],
});
