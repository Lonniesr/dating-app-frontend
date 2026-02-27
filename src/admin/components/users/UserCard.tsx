interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    photo?: string;
    banned?: boolean;
    roles?: string[];
  };
  onSelect: () => void;
}

export default function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div
      onClick={onSelect}
      className="
        bg-[#111] border border-yellow-500/10 rounded-xl p-4 cursor-pointer
        hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(255,215,0,0.25)]
        transition group
      "
    >
      {/* PHOTO */}
      <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
        <img
          src={user.photo}
          alt={user.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* NAME */}
      <div className="text-lg font-semibold text-gray-200">
        {user.name}
      </div>

      {/* EMAIL */}
      <div className="text-sm text-gray-500">{user.email}</div>

      {/* STATUS */}
      <div className="mt-2">
        {user.banned ? (
          <span className="text-red-400 text-sm">Banned</span>
        ) : (
          <span className="text-green-400 text-sm">Active</span>
        )}
      </div>

      {/* ROLES */}
      <div className="mt-3 flex flex-wrap gap-2">
        {user.roles?.map((r) => (
          <span
            key={r}
            className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
