import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

import { adminVerificationService } from "../services/adminVerificationService";
import type { VerificationUser } from "../services/adminVerificationService";

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<VerificationUser[]>({
    queryKey: ["admin-verification"],
    queryFn: () => adminVerificationService.list(),
  });

  const approveMutation = useMutation({
    mutationFn: (userId: string) => adminVerificationService.approve(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-verification"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (userId: string) => adminVerificationService.reject(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-verification"] }),
  });

  if (isLoading) {
    return <div className="glass-card">Loading verification queue…</div>;
  }

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Verification Queue
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "createdAt", label: "Joined" },
        ]}
        data={
          users?.map((u) => ({
            id: u.id,
            name: u.name ?? "Unknown",
            email: u.email,
            createdAt: new Date(u.createdAt).toLocaleDateString(),
          })) ?? []
        }
        actions={[
          {
            label: "Approve",
            className: "btn-gold",
            onClick: (row) => approveMutation.mutate(row.id),
          },
          {
            label: "Reject",
            className: "btn-danger",
            onClick: (row) => rejectMutation.mutate(row.id),
          },
        ]}
      />
    </div>
  );
}
