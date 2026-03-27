import { useQuery } from "@tanstack/react-query";

export function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`, // ✅ FIXED
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      // backend returns user directly (NOT { user: ... })
      return data ?? null;
    },
    staleTime: 1000 * 60 * 5,
  });
}