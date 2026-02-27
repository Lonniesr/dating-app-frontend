import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminVerificationService } from "../services/adminVerificationService";

export function useVerificationQueue() {
  return useQuery({
    queryKey: ["admin-verification"],
    queryFn: () => adminVerificationService.get().then(res => res.data),
  });
}

export function useApproveVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      adminVerificationService.post("approve", { userId }).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-verification"] }),
  });
}

export function useRejectVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      adminVerificationService.post("reject", { userId }).then(res => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-verification"] }),
  });
}
