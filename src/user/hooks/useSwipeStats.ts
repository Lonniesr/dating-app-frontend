import { useQuery } from "@tanstack/react-query";

type SwipeStatsResponse = {
  total: number;
  likes: number;
  passes: number;
  matches: number;
  activity: {
    createdAt: string;
    _count: number;
  }[];
};

export function useSwipeStats() {
  return useQuery<SwipeStatsResponse>({
    queryKey: ["swipe-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/swipe-stats`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    }
  });
}
