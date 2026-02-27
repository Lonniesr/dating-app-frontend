import { useQuery } from "@tanstack/react-query";

type MatchUser = {
  id: string;
  name: string;
  gender?: string;
  photo?: string;
  age?: number;
  location?: string;
};

export function useMatches() {
  return useQuery<MatchUser[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/matches`,
        { credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data;
    }
  });
}
