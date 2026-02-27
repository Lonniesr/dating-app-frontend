import { create } from "zustand";

interface ProfileState {
  profile: any | null;
  setProfile: (data: any) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,

  setProfile: (data) => set({ profile: data }),

  clearProfile: () => set({ profile: null }),
}));