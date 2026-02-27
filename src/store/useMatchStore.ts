import { create } from "zustand";

interface Match {
  id: string;
  userId: string;
  name: string;
  photo: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

interface MatchState {
  matches: Match[];
  loading: boolean;

  setMatches: (list: Match[]) => void;
  updateMatch: (matchId: string, data: Partial<Match>) => void;
  addMatch: (match: Match) => void;
  clearMatches: () => void;
  setLoading: (value: boolean) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matches: [],
  loading: false,

  setMatches: (list) => set({ matches: list }),

  updateMatch: (matchId, data) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId ? { ...m, ...data } : m
      ),
    })),

  addMatch: (match) =>
    set((state) => ({
      matches: [...state.matches, match],
    })),

  clearMatches: () => set({ matches: [] }),

  setLoading: (value) => set({ loading: value }),
}));