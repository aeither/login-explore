"use server";

import { env } from "@/env";

type TranslationResponse = {
  translations: Translation[];
};

type Translation = {
  detected_source_language: string;
  text: string;
};

export async function translateTextDeepl(text: string, targetLang: string) {
  const options = {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${env.DEEPL_KEY}` },
  };

  const data: TranslationResponse | { error: Error } = await fetch(
    `https://api-free.deepl.com/v2/translate?text=${text}&target_lang=${targetLang}`,
    options,
  ).then((response) => response.json());
  console.log("🚀 ~ file: helpers.ts:23 ~ translateText ~ data:", data);

  if ("error" in data) {
    throw new Error(data.error.message);
  }

  return {
    text: data.translations[0]?.text,
    sourceLangCode: data.translations[0]?.detected_source_language,
  };
}
