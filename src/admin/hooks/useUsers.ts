import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/adminUsersService";

export function useUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminUsersService.get().then(res => res.data),
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminUsersService.get(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      adminUsersService.post("ban", { userId }).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      adminUsersService.post("unban", { userId }).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}
