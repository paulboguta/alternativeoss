import { cleanClaudeResponse } from "./core";

import { anthropic } from "./core";

import { CLAUDE_MODELS } from "./core";

export async function generateProjectSummary(
  projectName: string, 
  url: string, 
  ai_description?: string
) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODELS.SONNET,
    messages: [
      {
        role: "user",
        content: `
  You are an expert at summarizing and extracting key features from open source projects. Given the following inputs:
  
  <data_inputs>
  ${JSON.stringify({
    projectName,
    url,
    additionalContext: ai_description || "",
  })}
  </data_inputs>
  
  Summary: A brief, one- or two-sentence overview of the project.
  Bullet Point Features: A list of key features or highlights of the project, with each bullet point clearly and succinctly conveying a single feature.
  For example, if the inputs are:
  
  Your output should look like:
  
  Summary:
  A short, engaging description of what the project does and its core value proposition. Treat it as a tagline.
  
  Long Description:
  A detailed description of the project.
  
  Features:
  
  Feature 1: [A concise key point]
  Feature 2: [Another key point]
  Feature 3: [Additional highlight]
  
  Output Format (JSON):
  
  {
  "summary": "",
  "longDescription": "",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  }
  
  <assistant_instructions>
  You check if the output format is just a JSON - nothing else. Reasonate about it here.
  </assistant_instructions>
  
  Requirements:
  1. Response is clear, concise, and uses bullet points for the features section.
  2. You don't mention installation steps or other not related things from the README
  3. You foucs on the product only.
  4. You output the JSON format exactly, no other text or formatting. Only the JSON object.
  5. The weight for the reasoning should be: 70% your knowledge, 30% the data provided
  6. If ai_description is provided, use it to enhance your understanding of the project.
  `.trim(),
      },
    ],
    max_tokens: 1000,
  });

  const responseText =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  return cleanClaudeResponse(responseText);
}
