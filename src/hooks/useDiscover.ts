import { useQuery } from "@tanstack/react-query";

export function useDiscover() {
  return useQuery({
    queryKey: ["discover"],

    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/discover`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Discover fetch failed");
      }

      return res.json();
    },

    staleTime: 30000,
    retry: 2,
  });
}