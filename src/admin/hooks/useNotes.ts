import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminNotesService } from "../services/adminNotesService";

export function useUpdateNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; notes: string }) =>
      adminNotesService.post("update", payload).then(res => res.data),
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useUpdateFlags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: string; flags: any }) =>
      adminNotesService.post("flags", payload).then(res => res.data),
    onSuccess: () => qc.invalidateQueries(),
  });
}
