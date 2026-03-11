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

      const json = await res.json();

      // Backend returns { success, profiles }
      return json.profiles ?? [];
    },

    staleTime: 30000,
    retry: 2,
  });
}