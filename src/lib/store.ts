import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  videoId: string;
  setVideoId: (videoId: string) => void;
  selectedPair: Word | null;
  setSelectedPair: (selectedWord: Word | null) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
}

interface PersistState {
  openaiKey: string | undefined;
  setOpenaiKey: (openaiKey: string | undefined) => void;
  words: Word[];
  addWord: (word: string, translation: string) => void;
  removeWord: (index: number) => void;
  myLangCode: string | undefined;
  setMyLangCode: (myLangCode: string | undefined) => void;
  targetLangCode: string | undefined;
  setTargetLangCode: (targetLangCode: string | undefined) => void;
  firstTime: boolean;
  setFirstTime: (firstTime: boolean) => void;
}

interface Word {
  word: string;
  translation: string;
}

export const useStore = create<State>((set) => ({
  loading: false,
  setLoading: (loading) => set(() => ({ loading: loading })),
  videoId: "",
  setVideoId: (videoId) => set(() => ({ videoId: videoId })),
  selectedPair: null,
  setSelectedPair: (selectedPair) =>
    set(() => ({ selectedPair: selectedPair })),
  currentTime: 0,
  setCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
}));

export const usePersistStore = create<PersistState>()(
  persist(
    (set) => ({
      openaiKey: undefined,
      setOpenaiKey: (openaiKey) => set(() => ({ openaiKey: openaiKey })),
      words: [],
      addWord: (word, translation) =>
        set((state) => ({ words: [...state.words, { word, translation }] })),
      removeWord: (index) =>
        set((state) => ({ words: state.words.filter((_, i) => i !== index) })),
      myLangCode: undefined,
      setMyLangCode: (myLangCode) => set(() => ({ myLangCode: myLangCode })),
      targetLangCode: undefined,
      setTargetLangCode: (targetLangCode) =>
        set(() => ({ targetLangCode: targetLangCode })),
      firstTime: true,
      setFirstTime: (firstTime) => set(() => ({ firstTime: firstTime })),
    }),
    {
      name: "videomind-storage",
    },
  ),
);
