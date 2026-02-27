import { useQuery } from "@tanstack/react-query";

type DiscoverUser = {
  id: string;
  name: string;
  age: number;
  location?: string;
  photos?: string[];
  gender?: string;
};

export function useDiscover() {
  return useQuery<DiscoverUser[]>({
    queryKey: ["discover-feed"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/discover`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load discover feed");
      }

      const data = await res.json();
      return data;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}
