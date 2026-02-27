import { create } from "zustand";
import { onboardingClient } from "../api/onboardingClient";

interface Prompt {
  question: string;
  answer: string;
}

interface OnboardingState {
  name: string;
  age: number | null;
  bio: string;
  location: string;
  interests: string[];
  prompts: Prompt[];
  photos: string[];

  step: number;
  loading: boolean;

  setBasic: (data: { name?: string; age?: number; bio?: string; location?: string }) => void;
  setInterests: (interests: string[]) => void;
  setPrompts: (prompts: Prompt[]) => void;
  setPhotos: (photos: string[]) => void;

  saveBasic: () => Promise<void>;
  saveInterests: () => Promise<void>;
  savePrompts: () => Promise<void>;
  savePhotos: () => Promise<void>;
  completeOnboarding: () => Promise<void>;

  nextStep: () => void;
  prevStep: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  name: "",
  age: null,
  bio: "",
  location: "",
  interests: [],
  prompts: [],
  photos: [],

  step: 0,
  loading: false,

  setBasic: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  setInterests: (interests) =>
    set((state) => ({
      ...state,
      interests,
    })),

  setPrompts: (prompts) =>
    set((state) => ({
      ...state,
      prompts,
    })),

  setPhotos: (photos) =>
    set((state) => ({
      ...state,
      photos,
    })),

  saveBasic: async () => {
    const { name, age, bio, location } = get();
    set({ loading: true });
    await onboardingClient.saveBasic({ name, age: age ?? undefined, bio, location });
    set({ loading: false });
  },

  saveInterests: async () => {
    const { interests } = get();
    set({ loading: true });
    await onboardingClient.saveInterests(interests);
    set({ loading: false });
  },

  savePrompts: async () => {
    const { prompts } = get();
    set({ loading: true });
    await onboardingClient.savePrompts(prompts);
    set({ loading: false });
  },

  savePhotos: async () => {
    const { photos } = get();
    set({ loading: true });
    await onboardingClient.savePhotos(photos);
    set({ loading: false });
  },

  completeOnboarding: async () => {
    set({ loading: true });
    await onboardingClient.complete();
    set({ loading: false });
  },

  nextStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(0, state.step - 1),
    })),
}));