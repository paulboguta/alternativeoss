import { env } from "@/env";
import { Anthropic } from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: env.CLAUDE_API_KEY as string,
});

export const CLAUDE_MODELS = {
  HAIKU: "claude-3-5-haiku-20241022",
  OPUS: "claude-3-opus-20240229",
  SONNET: "claude-3-5-sonnet-20241022",
} as const;

// ---

export function cleanClaudeResponse(responseText: string): string {
  return responseText
    .trim()
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/\\n/g, " ")
    .replace(/[\u201C\u201D]/g, '"') // Convert smart quotes
    .replace(/[\u2018\u2019]/g, "'"); // Convert smart single quotes
}

export function extractJsonFromResponse(responseText: string) {
  try {
    return JSON.parse(responseText);
  } catch {
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in Claude response");
    }

    const jsonText = responseText.slice(jsonStart, jsonEnd + 1).trim();
    return JSON.parse(jsonText);
  }
}

export function extractTextContent(responseText: string): string {
  try {
    const parsed = JSON.parse(responseText);
    return (
      parsed.summary ||
      parsed.text ||
      parsed.content ||
      parsed.description ||
      responseText
    );
  } catch {
    return responseText
      .replace(/^\s*[{"\[]+(summary|text|content|description)?[":]?\s*/i, "")
      .replace(/^\s*[{"\[]+(summary|text|content|description)?[":]?\s*/i, "")
      .replace(/[}"\]]+\s*$/i, "")
      .trim();
  }
}

// ---

export async function generateProjectSummary(
  projectName: string,
  url: string,
  readme: string
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
  readme,
})}
</data_inputs>

Summary: A brief, one- or two-sentence overview of the project.
Bullet Point Features: A list of key features or highlights of the project, with each bullet point clearly and succinctly conveying a single feature.
For example, if the inputs are:

Your output should look like:

Summary:
A short, engaging description of what the project does and its core value proposition.

Features:

Feature 1: [A concise key point]
Feature 2: [Another key point]
Feature 3: [Additional highlight]

Output Format (JSON):

{
"summary": "",
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
5. The weight for the reasoning should be: 70% your knowledge, 30% the data provided (unless you have no knowledge about the project).
`.trim(),
      },
    ],
    max_tokens: 1000,
  });

  const responseText =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  return cleanClaudeResponse(responseText);
}
