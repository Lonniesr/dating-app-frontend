import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type DiscoverProfile = {
  id: string;
  name: string;
  gender?: string;
  race?: string;
  birthdate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
};

type DiscoverResponse = {
  profiles: DiscoverProfile[];
  nextCursor: number | null;
};

export function useDiscover() {
  const query = useInfiniteQuery<DiscoverResponse>({
    queryKey: ["discover"],
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const url = `${import.meta.env.VITE_API_URL}/api/discover?cursor=${pageParam}`;

      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Discover fetch failed");
      }

      return res.json();
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  /* Memoize flattened pages so reference stays stable */

  const profiles = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.profiles) ?? [];
  }, [query.data]);

  return {
    ...query,
    data: profiles,
  };
}