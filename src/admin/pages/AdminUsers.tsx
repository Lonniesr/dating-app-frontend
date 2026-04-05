import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import { adminUsersService } from "../services/adminUsersService";

/* =========================
   TYPES
========================= */

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  banned: boolean;
  createdAt: string;
}

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

/* =========================
   COMPONENT
========================= */

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AdminUsersResponse>({
    queryKey: ["admin-users"],
    queryFn: () => adminUsersService.list(),
  });

  const users = data?.users ?? [];
  const totalUsers = data?.total ?? 0;

  const banMutation = useMutation({
    mutationFn: ({ id, banned }: { id: string; banned: boolean }) =>
      adminUsersService.updateUser(id, { banned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (isLoading) {
    return <div className="glass-card">Loading users…</div>;
  }

  return (
    <div className="fade-in">

      {/* HEADER */}
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1rem" }}
      >
        Users ({totalUsers.toLocaleString()})
      </h1>

      {/* KPI */}
      <div
        className="glass-panel"
        style={{ marginBottom: "1.5rem", padding: "1rem", width: "fit-content" }}
      >
        <p style={{ opacity: 0.6 }}>Total Users</p>
        <h2 style={{ fontSize: "1.8rem" }}>
          {totalUsers.toLocaleString()}
        </h2>
      </div>

      {/* TABLE */}
      <DataTable
        searchable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Joined" },
        ]}
        data={users.map((u: AdminUser) => ({
          id: u.id,
          name: u.name ?? "Unknown",
          email: u.email,
          status: u.banned ? "Banned" : "Active",
          createdAt: new Date(u.createdAt).toLocaleDateString(),
        }))}
        onRowClick={(row: any) => navigate(`/admin/users/${row.id}`)}
        actions={[
          {
            label: "Ban",
            className: "btn-danger",
            onClick: (row: any) =>
              banMutation.mutate({ id: row.id, banned: true }),
          },
          {
            label: "Unban",
            className: "btn-outline",
            onClick: (row: any) =>
              banMutation.mutate({ id: row.id, banned: false }),
          },
        ]}
      />
    </div>
  );
}