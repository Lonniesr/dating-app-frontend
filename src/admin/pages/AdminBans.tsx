import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useBannedUsers } from "../hooks/useBans";
import { adminBansService } from "../services/adminBansService";
import DataTable from "../components/DataTable";

export default function AdminBansPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useBannedUsers();

  const bans = data?.users ?? [];

  const unbanMutation = useMutation({
    mutationFn: (userId: string) => adminBansService.post("/unban", { userId }),
    onSuccess: () => queryClient.invalidateQueries(["admin-bans"]),
  });

  if (isLoading) {
    return <div className="glass-card p-4">Loading banned users…</div>;
  }

  if (error) {
    return <div className="glass-card p-4">Error loading banned users</div>;
  }

  return (
    <div className="page-wrapper fade-in">
      <h1 className="admin-gold-shimmer" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Bans
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "createdAt", label: "Banned On" },
        ]}
        data={bans.map((u) => ({
          id: u.id,
          name: u.name ?? "Unknown",
          email: u.email,
          createdAt: new Date(u.createdAt).toLocaleDateString(),
        }))}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        actions={[
          {
            label: "Unban",
            className: "btn-outline",
            onClick: (row) => unbanMutation.mutate(row.id),
          },
        ]}
      />
    </div>
  );
}
