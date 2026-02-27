import RoleCard from "./RoleCard";

interface Role {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
  permissions?: string[];
}

interface RolesGridProps {
  roles: Role[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  reloadRoles: () => void;
}

export default function RolesGrid({
  roles,
  loading,
  error,
  onRetry,
  reloadRoles,
}: RolesGridProps) {
  if (loading) {
    return <div className="text-gray-400 text-lg">Loading roles…</div>;
  }

  if (error) {
    return (
      <div className="text-red-400">
        Failed to load roles
        <button
          onClick={onRetry}
          className="ml-4 px-3 py-1 bg-yellow-500 text-black rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (roles.length === 0) {
    return <div className="text-gray-500">No roles found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} reloadRoles={reloadRoles} />
      ))}
    </div>
  );
}
