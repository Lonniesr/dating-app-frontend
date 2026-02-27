import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  roles?: string[];
}

interface UserRolesManagerProps {
  user: User;
  reloadUsers: () => void;
}

export default function UserRolesManager({ user, reloadUsers }: UserRolesManagerProps) {
  const [roles, setRoles] = useState<string[]>(user.roles || []);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllRoles();
  }, []);

  async function loadAllRoles() {
    try {
      const res = await apiClient.get("/admin/roles");
      const payload = (res as any)?.data ?? res;
      setAllRoles(payload.roles || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleRole(roleId: string) {
    try {
      setLoading(true);

      const hasRole = roles.includes(roleId);

      await apiClient.post("/admin/users/roles", {
        userId: user.id,
        roleId,
        action: hasRole ? "remove" : "add",
      });

      const updated = hasRole
        ? roles.filter((r) => r !== roleId)
        : [...roles, roleId];

      setRoles(updated);
      reloadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {allRoles.map((role) => {
        const active = roles.includes(role.id);

        return (
          <button
            key={role.id}
            disabled={loading}
            onClick={() => toggleRole(role.id)}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded
              border transition
              ${
                active
                  ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                  : "bg-[#1a1a1a] border-yellow-500/10 text-gray-300 hover:bg-[#222]"
              }
            `}
          >
            <span>{role.name}</span>
            {active ? "✓" : "+"}
          </button>
        );
      })}
    </div>
  );
}
