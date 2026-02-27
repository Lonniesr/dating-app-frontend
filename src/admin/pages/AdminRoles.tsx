import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

import { adminRolesService } from "../services/adminRolesService";
import type { Role, RoleUser } from "../services/adminRolesService";

export default function AdminRolesPage() {
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [assignForm, setAssignForm] = useState({
    userId: "",
    role: "admin",
  });

  const { data: roles } = useQuery<Role[]>({
    queryKey: ["admin-roles"],
    queryFn: () => adminRolesService.listRoles(),
  });

  const { data: users, isLoading } = useQuery<RoleUser[]>({
    queryKey: ["admin-role-users", selectedRole],
    queryFn: () => adminRolesService.listUsersByRole(selectedRole),
  });

  const assignMutation = useMutation({
    mutationFn: () =>
      adminRolesService.assignRole(assignForm.userId, assignForm.role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-role-users", selectedRole],
      });
      setAssignForm({ userId: "", role: selectedRole });
    },
  });

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Role Management
      </h1>

      <div className="glass-panel" style={{ marginBottom: "2rem" }}>
        <h2 className="h2">Select Role</h2>

        <select
          className="select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ marginTop: "1rem", width: "200px" }}
        >
          {roles?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel" style={{ marginBottom: "2rem" }}>
        <h2 className="h2">Assign Role to User</h2>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <input
            className="input"
            placeholder="User ID"
            value={assignForm.userId}
            onChange={(e) =>
              setAssignForm({ ...assignForm, userId: e.target.value })
            }
          />

          <select
            className="select"
            value={assignForm.role}
            onChange={(e) =>
              setAssignForm({ ...assignForm, role: e.target.value })
            }
          >
            {roles?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            className="btn-gold"
            onClick={() => assignMutation.mutate()}
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending ? "Assigning…" : "Assign"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="h2" style={{ marginBottom: "1rem" }}>
          Users with role: {selectedRole}
        </h2>

        {isLoading ? (
          <div className="glass-card">Loading users…</div>
        ) : (
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
          />
        )}
      </div>
    </div>
  );
}
