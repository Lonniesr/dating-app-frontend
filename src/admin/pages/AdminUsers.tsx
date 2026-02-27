import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import { adminUsersService } from "../services/adminUsersService";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  banned: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => adminUsersService.list(),
  });

  const users = data ?? [];

  const banMutation = useMutation<
    unknown,
    Error,
    { id: string; banned: boolean }
  >({
    mutationFn: ({ id, banned }) =>
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
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Users
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Joined" },
        ]}
        data={users.map((u) => ({
          id: u.id,
          name: u.name ?? "Unknown",
          email: u.email,
          status: u.banned ? "Banned" : "Active",
          createdAt: new Date(u.createdAt).toLocaleDateString(),
        }))}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        actions={[
          {
            label: "Ban",
            className: "btn-danger",
            onClick: (row) =>
              banMutation.mutate({ id: row.id, banned: true }),
          },
          {
            label: "Unban",
            className: "btn-outline",
            onClick: (row) =>
              banMutation.mutate({ id: row.id, banned: false }),
          },
        ]}
      />
    </div>
  );
}
