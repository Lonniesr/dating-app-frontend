import { create } from "zustand";

interface OnboardingState {
  step: number;

  age: number | null;
  gender: string | null;
  interests: string[];
  photos: string[];
  profile: {
    name: string;
    bio: string;
  } | null;
  prompts: string[];

  setStep: (step: number) => void;

  setAge: (age: number) => void;
  setGender: (gender: string) => void;
  setInterests: (list: string[]) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
  setProfile: (data: { name: string; bio: string }) => void;
  setPrompts: (list: string[]) => void;

  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,

  age: null,
  gender: null,
  interests: [],
  photos: [],
  profile: null,
  prompts: ["", "", ""],

  setStep: (step) => set({ step }),

  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setInterests: (list) => set({ interests: list }),

  addPhoto: (url) =>
    set((state) => ({
      photos: [...state.photos, url],
    })),

  removePhoto: (index) =>
    set((state) => ({
      photos: state.photos.filter((_, i) => i !== index),
    })),

  setProfile: (data) => set({ profile: data }),

  setPrompts: (list) => set({ prompts: list }),

  reset: () =>
    set({
      step: 1,
      age: null,
      gender: null,
      interests: [],
      photos: [],
      profile: null,
      prompts: ["", "", ""],
    }),
}));