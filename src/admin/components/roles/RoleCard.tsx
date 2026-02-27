import { apiClient } from "../../services/apiClient";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import RolePermissionsEditor from "./RolePermissionsEditor";

interface Role {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
}

interface RoleCardProps {
  role: Role;
  reloadRoles: () => void;
}

export default function RoleCard({ role, reloadRoles }: RoleCardProps) {
  const [loading, setLoading] = useState(false);

  async function deleteRole() {
    try {
      setLoading(true);
      await apiClient.delete(`/admin/roles/${role.id}`);
      reloadRoles();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        bg-[#111] border border-yellow-500/10 rounded-xl p-4
        hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(255,215,0,0.25)]
        transition
      "
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-lg font-semibold text-gray-200">
            {role.name}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {role.description || "No description"}
          </div>
        </div>

        <button
          onClick={deleteRole}
          disabled={loading}
          className="text-red-400 hover:text-red-300 transition"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {role.userCount ?? 0} users
      </div>

      <RolePermissionsEditor role={role} reloadRoles={reloadRoles} />
    </div>
  );
}
