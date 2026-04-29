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

interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AdminUsersResponse>({
    queryKey: ["admin-users"],
    queryFn: () => adminUsersService.list(),
  });

  const users = data?.users ?? [];

  // ✅ BAN
  const banMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminUsersService.banUser(id, { reason }), // ✅ FIXED
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  // ✅ UNBAN
  const unbanMutation = useMutation({
    mutationFn: (id: string) => adminUsersService.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer">Users</h1>

      <DataTable
        searchable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
        ]}
        data={users.map((u) => ({
          id: u.id,
          name: u.name ?? "Unknown",
          email: u.email,
          status: u.banned ? "Banned" : "Active",
        }))}
        actions={[
          {
            label: "Ban",
            className: "btn-danger",
            onClick: (row: any) => {
              if (row.status === "Banned") return; // ✅ manual guard

              const reason = prompt("Enter ban reason:");
              if (!reason) return;

              if (confirm("Ban this user?")) {
                banMutation.mutate({ id: row.id, reason });
              }
            },
          },
          {
            label: "Unban",
            className: "btn-outline",
            onClick: (row: any) => {
              if (row.status === "Active") return; // ✅ manual guard

              if (confirm("Unban this user?")) {
                unbanMutation.mutate(row.id);
              }
            },
          },
        ]}
        onRowClick={(row: any) => navigate(`/admin/users/${row.id}`)}
      />
    </div>
  );
}