"use server";

import { env } from "@/env";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const groq = createOpenAI({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  apiKey: env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getWordInfo(text: string, line: string, lang: string) {
  const resp = await generateText({
    model: groq("llama3-8b-8192"),
    system: `Breakdown meaning of the word and provided the context from the phrase, explain and show 3 phrases using the word in contenxt with translation and pronounciation.Format response in markdown. Respond all and only in the language of language code ${lang}`,
    prompt: `${text} in ${line}`,
  });

  return resp.text;
}
