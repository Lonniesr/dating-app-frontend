import { useState } from "react";
import { apiClient } from "../../services/apiClient";

interface RoleCreateFormProps {
  reloadRoles: () => void;
}

export default function RoleCreateForm({ reloadRoles }: RoleCreateFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function createRole() {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await apiClient.post("/admin/roles", {
        name,
        description,
      });

      setName("");
      setDescription("");
      reloadRoles();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10 space-y-4">
      <div className="text-gray-300 font-medium">Create Role</div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
        className="
          w-full px-3 py-2 rounded bg-[#1a1a1a] text-gray-200 
          border border-yellow-500/20 placeholder-gray-500
          focus:outline-none focus:border-yellow-400
        "
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="
          w-full px-3 py-2 rounded bg-[#1a1a1a] text-gray-200 
          border border-yellow-500/20 placeholder-gray-500
          focus:outline-none focus:border-yellow-400
        "
      />

      <button
        onClick={createRole}
        disabled={loading}
        className="
          px-4 py-2 rounded bg-yellow-500 text-black 
          hover:bg-yellow-400 transition
        "
      >
        Create Role
      </button>
    </div>
  );
}
