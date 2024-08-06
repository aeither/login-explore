// import { generateAudio } from "@/app/actions/language/deepgram";
// import { DeepGramLang } from "@/app/actions/language/deepgram.types";
// const lang = DeepGramLang.Korean;

import React, { useEffect, useState } from "react";

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 1500);
  }, [hasCopied]);

  const copyToClipboard = async (value: string) => {
    void navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  return {
    copyToClipboard,
    hasCopied,
  };
}

// export const useNarrate = () => {
//   const handleGenerateAudio = useCallback(async (text: string) => {
//     try {
//       const audioBuffer = await generateAudio(text, lang);

//       const audioInstance = new Audio(
//         "data:audio/wav;base64," + audioBuffer.data,
//       );
//       void audioInstance.play();
//     } catch (error) {
//       console.error("Error generating audio:", error);
//     }
//   }, []);

//   return {
//     handleGenerateAudio,
//   };
// };
