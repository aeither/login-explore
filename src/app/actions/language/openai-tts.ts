"use server";

import { env } from "@/env";
import { OpenAI } from "openai";

export async function tts(text: string) {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  let mp3Based64;
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });

    if (mp3.ok) {
      mp3Based64 = Buffer.from(await mp3.arrayBuffer()).toString("base64");
    } else {
      mp3Based64 = { ok: false };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    data: mp3Based64,
  };
}
