import { useAuthUser } from "../../hooks/useAuthUser";

type ProfileUser = {
  name: string;
  email: string;
  gender?: string;
  location?: string;
  photos?: string[];
};

export default function ProfileSummary() {
  const { data } = useAuthUser();
  const user = data?.user as ProfileUser | undefined;

  if (!user) {
    return (
      <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-white/60">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-white">
      <h2 className="text-xl font-semibold mb-3">My Profile</h2>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <img
            src={user.photos?.[0] || "/placeholder.jpg"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Basic Info */}
        <div>
          <p className="font-bold text-lg">{user.name}</p>
          <p className="text-white/60 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 text-white/70 text-sm space-y-1">
        <p>
          <strong>Gender:</strong> {user.gender || "—"}
        </p>
        <p>
          <strong>Location:</strong> {user.location || "—"}
        </p>
      </div>
    </div>
  );
}
