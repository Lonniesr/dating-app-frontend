import { useQuery } from "@tanstack/react-query";
import { adminMatchesService } from "../services/adminMatchesService";

export function useMatches() {
  return useQuery({
    queryKey: ["admin-matches"],
    queryFn: () => adminMatchesService.get().then(res => res.data),
  });
}
