import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminInvitesService } from "../services/adminInvitesService";

export function useInvites() {
  return useQuery({
    queryKey: ["admin-invites"],
    queryFn: () => adminInvitesService.get().then(res => res.data),
  });
}

export function useCreateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminInvitesService.post().then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-invites"] }),
  });
}
