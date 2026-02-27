import { useQuery } from "@tanstack/react-query";
import { adminBansService } from "../services/adminBansService";

export function useBannedUsers() {
  return useQuery({
    queryKey: ["admin-bans"],
    queryFn: () => adminBansService.get().then(res => res.data),
  });
}
