import { useQuery } from "@tanstack/react-query";

export function useMessages() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        {
          credentials: "include", // ⭐ send the cookie!
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      return res.json();
    },
  });
}
