import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";

const AVAILABLE_PERMISSIONS = [
  "users.view",
  "users.manage",
  "roles.view",
  "roles.manage",
  "reports.view",
  "reports.moderate",
];

interface Role {
  id: string;
  permissions?: string[];
}

interface RolePermissionsEditorProps {
  role: Role;
  reloadRoles: () => void;
}

export default function RolePermissionsEditor({
  role,
  reloadRoles,
}: RolePermissionsEditorProps) {
  const [permissions, setPermissions] = useState<string[]>(role.permissions || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPermissions(role.permissions || []);
  }, [role.id]);

  async function togglePermission(p: string) {
    try {
      setLoading(true);

      const has = permissions.includes(p);

      const res = await apiClient.post(`/admin/roles/${role.id}/permissions`, {
        permission: p,
        action: has ? "remove" : "add",
      });

      const payload = (res as any)?.data ?? res;
      setPermissions(payload.permissions || []);
      reloadRoles();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="text-xs text-gray-400 mb-1">Permissions</div>

      {AVAILABLE_PERMISSIONS.map((p) => {
        const active = permissions.includes(p);

        return (
          <button
            key={p}
            disabled={loading}
            onClick={() => togglePermission(p)}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded
              border text-xs transition
              ${
                active
                  ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                  : "bg-[#1a1a1a] border-yellow-500/10 text-gray-300 hover:bg-[#222]"
              }
            `}
          >
            <span>{p}</span>
            {active ? "✓" : "+"}
          </button>
        );
      })}
    </div>
  );
}
