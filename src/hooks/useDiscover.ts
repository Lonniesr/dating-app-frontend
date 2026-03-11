import { useQuery } from "@tanstack/react-query";

export function useDiscover() {
  console.log("useDiscover hook mounted");

  return useQuery({
    queryKey: ["discover"],

    queryFn: async () => {
      console.log("Discover queryFn executing");

      const url = `${import.meta.env.VITE_API_URL}/api/discover`;
      console.log("Discover request URL:", url);

      const res = await fetch(url, {
        credentials: "include",
      });

      console.log("Discover response status:", res.status);

      if (!res.ok) {
        throw new Error("Discover fetch failed");
      }

      const json = await res.json();

      console.log("Discover raw response:", json);

      // Handle BOTH possible backend shapes
      const profiles = Array.isArray(json)
        ? json
        : json?.profiles ?? [];

      console.log("Discover profiles count:", profiles.length);

      return profiles;
    },

    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}