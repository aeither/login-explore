"use server";

import { env } from "@/env";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const groq = createOpenAI({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getTranslation(text: string) {
  const wordSchema = z.object({
    wordPronounciation: z.string(),
    wordTranslations: z.array(z.string()),
  });

  const prompt = `Generate an object representing of the word "${text}" with the following properties:
- Word pronunciation (IPA or phonetic spelling)  
- Possible Translations of the word

Provide the data in a format compatible with this TypeScript type:
${JSON.stringify(wordSchema)}
`;

  const generatedWord = await generateObject({
    model: groq("llama3-8b-8192"),
    prompt,
    schema: wordSchema,
  });

  return generatedWord.object;
}
