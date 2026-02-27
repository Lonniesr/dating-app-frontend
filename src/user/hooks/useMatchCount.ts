import { useQuery } from "@tanstack/react-query";

type MatchCountResponse = {
  count: number;
};

export function useMatchCount() {
  return useQuery<MatchCountResponse>({
    queryKey: ["match-count"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/match-count`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    }
  });
}
