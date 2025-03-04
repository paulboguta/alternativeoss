import { anthropic, CLAUDE_MODELS, cleanClaudeResponse } from './core';

export async function generateProjectAlternatives(
  projectName: string,
  alternatives: string[],
  ai_description?: string
) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODELS.SONNET,
    messages: [
      {
        role: 'user',
        content: `
    You are an expert at open source software as well as proprietary software. You are tasked to generate 1-5 alternatives for the following project. You will be given project name and list of
    available alternatives. You should assign the project to the relevant alternatives,
    but if none of them are relevant, you should create a new alternative. The output should be a JSON with 2 keys: alternatives and alternativesToAdd. You can check the structure of the JSON's keys below.
    You are free to assign project to 1-5 alternatives. You should not force assigning alternatives if there are no relevant ones - just add new alternatives. You should not force yourself to find 5 alternatives,
    if you can find only 2 relevant - that's fine. IMPORTANT: Alternative must be a proprietary software. Make sure alternatives are not open source.

    If you were to for example find proprietary alternatives for Calcom, it would look like this: 
    {
    name: "Calendly",
    url: "https://calendly.com",
    }

    Other example:

    If you are to find proprietary alternatives for Affine, it would look like this:
    {
    name: "Notion",
    url: "https://notion.so",
    }
    
    <data_inputs>
    ${JSON.stringify({
      projectName,
      alternatives,
      additionalContext: ai_description || '',
    })}
    </data_inputs>
    
    
    Output Format (JSON):
    
    {
    "alternatives": [
      {
      name: "Calendly",
      url: "https://calendly.com",
      },
    ],
    alternativesToAdd: [
     {
      name: "Notion",
      url: "https://notion.so",
      }
    ]
    }
    
    <assistant_instructions>
    You check if the output format is just a JSON - nothing else. Reasonate about it here.
    </assistant_instructions>
    
    Requirements:
    1. Uses JSON as a format without additional text.
    2. The weight for the reasoning should be: 70% your knowledge, 30% the data provided
    3. You should not add any other text or formatting. Only the JSON object.
    4. You should not force assigning alternatives if there are no relevant ones - just add new alternatives.
    5. Software (alternative) MUST be proprietary AND NOT open source.
    6. If ai_description is provided, use it to enhance your understanding of the project.
    `.trim(),
      },
    ],
    max_tokens: 1000,
  });

  const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';

  return cleanClaudeResponse(responseText);
}

export async function generateAlternativeSummary(alternativeName: string, ai_description?: string) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODELS.SONNET,
    messages: [
      {
        role: 'user',
        content: `
        You are an expert at open source software as well as proprietary software. You are tasked to generate a summary for the following proprietary software.
        Please make sure the summary is short and concise, preffered length is 9-14 words. If provided with additional context (most likely website text) you can use it
        to enhance your knowledge, but you should base the summary on your knowledge about the software first.
        
        <data_inputs>
        ${JSON.stringify({
          alternativeName,
          additionalContext: ai_description || '',
        })}
        </data_inputs>
        
        <assistant_instructions>
        You check if the output format is just a JSON - nothing else. Reasonate about it here.
        </assistant_instructions>

      Output Format (JSON):
    
      {
        "summary": "This is a summary"
      }
      
      Example summary of Cal.com:

      {
        "summary": "Cal.com is a scheduling tool that allows you to schedule meetings with your clients."
      }
        
        Requirements:
        1. Uses JSON as a format without additional text.
        2. The weight for the reasoning should be: 70% your knowledge, 30% the data provided
        `,
      },
    ],
    max_tokens: 180,
  });

  const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';

  return cleanClaudeResponse(responseText);
}
