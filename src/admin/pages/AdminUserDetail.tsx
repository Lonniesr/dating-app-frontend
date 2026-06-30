import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminUserDetailService } from "../services/adminUserDetailService";
import type { AdminUserDetail } from "../services/adminUserDetailService";
import UserHeader from "../components/userDetail/UserHeader";
import UserStats from "../components/userDetail/UserStats";
import UserInfo from "../components/userDetail/UserInfo";
import UserPhotos from "../components/userDetail/UserPhotos";
import UserMatches from "../components/userDetail/UserMatches";
import UserInvites from "../components/userDetail/UserInvites";
import UserSwipes from "../components/userDetail/UserSwipes";
import UserMessages from "../components/userDetail/UserMessages";
import UserVerification from "../components/userDetail/UserVerification";
import UserModeration from "../components/userDetail/UserModeration";

// 🔥 ADDED (helper)
const getTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function AdminUserDetailPage() {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery<AdminUserDetail>({
    queryKey: ["admin-user-detail", id],
    queryFn: () => adminUserDetailService.get(id as string),
    enabled: !!id,
  });

  const { data: onlineData } = useQuery({
    queryKey: ["online-users"],
    queryFn: async () => {
     const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/admin/online`,
  {
    credentials: "include",
  }
);
      return res.json();
    },
    refetchInterval: 5000,
  });

  console.log("🔥 USER FROM API:", user);

  if (isLoading) {
    return <div className="glass-card">Loading user…</div>;
  }

  if (!user) {
    return <div className="glass-card">User not found.</div>;
  }

  // 🔥 FIXED (correct scope)
  const isOnline = onlineData?.online?.includes(user.id);

  // ✅ SAFETY LAYER (CRITICAL FIX)
  const photos = user.photos ?? [];
  const matches = user.matches ?? [];

  return (
  <div className="fade-in">
    <UserHeader
      user={user}
      isOnline={isOnline}
      getTimeAgo={getTimeAgo}
    />

    <UserStats user={user} />

    <div
      style={{
        display: "grid",

      gridTemplateColumns:
        "repeat(auto-fit, minmax(450px, 1fr))",
        gap: "1.5rem",
        alignItems: "start",
      }}
    >
      {/* LEFT COLUMN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <UserInfo user={user} />

        <UserPhotos
          photos={photos}
        />

        <UserMatches
          matches={matches}
        />

        <UserSwipes
          user={user}
        />

        <UserInvites
          user={user}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <UserVerification user={user} />

        <UserModeration user={user} />

        <UserMessages user={user} />
      </div>
    </div>
  </div>
);
}