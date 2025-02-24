import { anthropic, CLAUDE_MODELS, cleanClaudeResponse } from "./core";

export async function generateProjectCategories(
  projectName: string,
  categories: string[]
) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODELS.SONNET,
    messages: [
      {
        role: "user",
        content: `
    You are an expert at categorizing open source software. You are tasked to assign the following project to the most relevant category/categories.
    You are given 2 data points: project name and current list of categories in the database. You should assign the project to the relevant categories,
    but if none of them are relevant, you should add a new category. The output should be a JSON with 2 keys: categories and categoriesToAdd. Each key is an array of strings.
    You are free to assign project to 1-5 categories. You should not force assigning categories if there are no relevant ones - just add new categories. 
    Keep their names short. Example: "API Tools", "Screen recording", "Calendar Scheduling", "Analytics".
    
    <data_inputs>
    ${JSON.stringify({
      projectName,
      categories,
    })}
    </data_inputs>
    
    
    Output Format (JSON):
    
    {
    "categories": [
      "category1",
      "category2",
      "category3"
    ],
    categoriesToAdd: [
      "category4",
      "category5"
    ]
    }
    
    <assistant_instructions>
    You check if the output format is just a JSON - nothing else. Reasonate about it here.
    </assistant_instructions>
    
    Requirements:
    1. Uses JSON as a format without additional text.
    2. The weight for the reasoning should be: 70% your knowledge, 30% the data provided
    3. You should not add any other text or formatting. Only the JSON object.
    4. You should not force assigning categories if there are no relevant ones - just add new categories.
    `.trim(),
      },
    ],
    max_tokens: 1000,
  });

  const responseText =
    response.content[0]?.type === "text" ? response.content[0].text : "";

  return cleanClaudeResponse(responseText);
}
