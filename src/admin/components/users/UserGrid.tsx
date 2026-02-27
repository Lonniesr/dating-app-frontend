import UserCard from "./UserCard";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  banned?: boolean;
  roles?: string[];
}

interface UserGridProps {
  users: User[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSelectUser: (user: User) => void;
}

export default function UserGrid({
  users,
  loading,
  error,
  onRetry,
  onSelectUser,
}: UserGridProps) {
  if (loading) {
    return <div className="text-gray-400 text-lg">Loading users…</div>;
  }

  if (error) {
    return (
      <div className="text-red-400">
        Failed to load users
        <button
          onClick={onRetry}
          className="ml-4 px-3 py-1 bg-yellow-500 text-black rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return <div className="text-gray-500">No users found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((u) => (
        <UserCard key={u.id} user={u} onSelect={() => onSelectUser(u)} />
      ))}
    </div>
  );
}
