import { create } from "zustand";

interface SwipeProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio?: string;
}

interface SwipeState {
  queue: SwipeProfile[];
  loading: boolean;

  setQueue: (profiles: SwipeProfile[]) => void;
  removeTop: () => void;
  addToQueue: (profile: SwipeProfile) => void;
  clearQueue: () => void;
  setLoading: (value: boolean) => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  queue: [],
  loading: false,

  setQueue: (profiles) => set({ queue: profiles }),

  removeTop: () =>
    set((state) => ({
      queue: state.queue.slice(1),
    })),

  addToQueue: (profile) =>
    set((state) => ({
      queue: [...state.queue, profile],
    })),

  clearQueue: () => set({ queue: [] }),

  setLoading: (value) => set({ loading: value }),
}));