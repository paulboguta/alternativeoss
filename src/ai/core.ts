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

export function cleanClaudeResponse(responseText: string): string {
  return responseText
    .trim()
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/\\n/g, " ")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");
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
    // First, try to parse as JSON
    const parsed = JSON.parse(responseText);
    // Look for common field names that might contain the text
    return (
      parsed.summary ||
      parsed.text ||
      parsed.content ||
      parsed.description ||
      responseText
    );
  } catch {
    // If it's not JSON, just clean up any potential JSON-like formatting
    return responseText

      .replace(/^\s*[{"\[]+(summary|text|content|description)?[":]?\s*/i, "")
      .replace(/[}"\]]+\s*$/i, "")
      .trim();
  }
}
