import { useQuery } from "@tanstack/react-query";
import { adminSwipesService } from "../services/adminSwipesService";

export function useSwipes(filters?: { userId?: string; direction?: string }) {
  const params = new URLSearchParams(filters as any).toString();

  return useQuery({
    queryKey: ["admin-swipes", filters],
    queryFn: () =>
      adminSwipesService.get(params ? `?${params}` : "").then(res => res.data),
  });
}
