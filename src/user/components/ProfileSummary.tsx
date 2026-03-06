import { useAuthUser } from "../../hooks/useAuthUser";
import GenderIcon from "./GenderIcon";

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

      <h2 className="text-sm text-white/60 mb-3">My Profile</h2>

      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <img
            src={user.photos?.[0] || "/placeholder.jpg"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Basic Info */}
        <div>
          <p className="font-semibold">{user.name}</p>

          <div className="flex items-center gap-2 text-xs text-white/60">

            {user.gender && <GenderIcon gender={user.gender} />}

            {user.location && <span>{user.location}</span>}

          </div>

        </div>

      </div>

    </div>
  );
}