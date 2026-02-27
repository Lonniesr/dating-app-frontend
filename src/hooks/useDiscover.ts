import { useQuery } from "@tanstack/react-query";

export function useDiscover() {
  return useQuery({
    queryKey: ["discover"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/discover`,
        {
          credentials: "include", // ⭐ send the cookie!
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch discover feed");
      }

      return res.json();
    },
  });
}
