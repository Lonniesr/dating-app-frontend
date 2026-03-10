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

  loading: boolean;

  setBasic: (data: {
    name?: string;
    age?: number;
    bio?: string;
    location?: string;
  }) => void;

  setInterests: (interests: string[]) => void;
  setPrompts: (prompts: Prompt[]) => void;
  setPhotos: (photos: string[]) => void;

  saveBasic: () => Promise<void>;
  savePreferences: () => Promise<void>;
  savePersonality: () => Promise<void>;
  savePhotos: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  name: "",
  age: null,
  bio: "",
  location: "",
  interests: [],
  prompts: [],
  photos: [],

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

  async saveBasic() {
    const { name, age, bio, location } = get();

    set({ loading: true });

    try {
      await onboardingClient.saveBasic({
        name,
        age: age ?? undefined,
        bio,
        location,
      });
    } finally {
      set({ loading: false });
    }
  },

  async savePreferences() {
    const { interests } = get();

    set({ loading: true });

    try {
      await onboardingClient.savePreferences({
        interests,
      });
    } finally {
      set({ loading: false });
    }
  },

  async savePersonality() {
    const { prompts } = get();

    set({ loading: true });

    try {
      await onboardingClient.savePersonality({
        prompts,
      });
    } finally {
      set({ loading: false });
    }
  },

  async savePhotos() {
    const { photos } = get();

    set({ loading: true });

    try {
      await onboardingClient.savePhotos(photos);
    } finally {
      set({ loading: false });
    }
  },

  async completeOnboarding() {
    set({ loading: true });

    try {
      await onboardingClient.complete();
    } finally {
      set({ loading: false });
    }
  },
}));