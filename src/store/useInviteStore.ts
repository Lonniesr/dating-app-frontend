import { create } from "zustand";

interface InviteState {
  inviteCode: string | null;
  setInviteCode: (code: string) => void;
  clearInvite: () => void;
}

export const useInviteStore = create<InviteState>((set) => ({
  inviteCode: null,

  setInviteCode: (code) => set({ inviteCode: code }),

  clearInvite: () => set({ inviteCode: null }),
}));