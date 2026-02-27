import { create } from "zustand";

interface UserState {
  user: any | null;
  setUser: (data: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (data) => set({ user: data }),

  clearUser: () => set({ user: null }),
}));