import { useQuery } from "@tanstack/react-query";

type SwipeStatsResponse = {
  likesGiven: number;
  passesGiven: number;
  superLikesGiven: number;
  likesReceived: number;
  matches: number;
};

const API = import.meta.env.VITE_API_URL;

export function useSwipeStats() {

  return useQuery<SwipeStatsResponse>({
    queryKey: ["swipe-stats"],

    queryFn: async () => {

      const res = await fetch(`${API}/api/swipe/stats`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load swipe stats");
      }

      return res.json();
    },

    staleTime: 0,
  });

}