import { useQuery } from "@tanstack/react-query";

export function useMatches() {
  return useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/matches`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log("🔥 ACTIVE MATCH RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch matches");
      }

      return data;
    },
  });
}