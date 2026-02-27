export default function UserFilters({ filters, setFilters }) {
  function update(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-wrap gap-4 bg-[#111] p-4 rounded-lg border border-yellow-500/10">

      {/* STATUS FILTER */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-400 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
          className="
            px-3 py-2 rounded bg-[#1a1a1a] text-gray-200 
            border border-yellow-500/20 focus:border-yellow-400
          "
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* ROLE FILTER */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-400 mb-1">Role</label>
        <select
          value={filters.role}
          onChange={(e) => update("role", e.target.value)}
          className="
            px-3 py-2 rounded bg-[#1a1a1a] text-gray-200 
            border border-yellow-500/20 focus:border-yellow-400
          "
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>

    </div>
  );
}
