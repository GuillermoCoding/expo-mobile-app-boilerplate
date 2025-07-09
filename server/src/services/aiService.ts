import OpenAI from 'openai';

import { Logger } from '@/utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzeStoolImageResponse {
  bristolCategoryId: number;
  description: string;
  observations: string;
  recommendations: string;
}

export async function analyzeStoolImage(imageUrl: string): Promise<AnalyzeStoolImageResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this stool image and provide the following information in JSON format:\n1. Bristol Stool Scale category (1-7)\n2. A brief description of the stool\n3. Any concerning observations\n4. Health recommendations based on the appearance\n\nThe response should contain these exact keys: bristolCategoryId, description, observations, recommendations"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ] as const
        }
      ],
      max_tokens: 500,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "stool_schema",
          schema: {
            type: "object",
            properties: {
              bristolCategoryId: { type: "number" },
            description: { type: "string" },
            observations: { type: "string" },
              recommendations: { type: "string" }
            },
            required: ["bristolCategoryId", "description", "observations", "recommendations"]
          }
        }
      },
    });

    console.log('response', response.choices[0]?.message);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(content);
    return {
      bristolCategoryId: parsedResponse.bristolCategoryId,
      description: parsedResponse.description,
      observations: parsedResponse.observations,
      recommendations: parsedResponse.recommendations,
    };
  } catch (error) {
    Logger.error('Error analyzing stool image:', error);
    throw error;
  }
} 
