import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminUserDetailService } from "../services/adminUserDetailService";
import type { AdminUserDetail } from "../services/adminUserDetailService";

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
      {/* HEADER */}
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        User Profile
      </h1>

      {/* PROFILE CARD */}
      <div
        className="glass-panel"
        style={{ padding: "2rem", marginBottom: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <h2 className="h2">{user.name ?? "Unnamed User"}</h2>

          {/* 🟢 ONLINE DOT */}
          <div
  style={{
    position: "relative",
    width: "10px",
    height: "10px",
  }}
>
  {/* MAIN DOT */}
  <div
    style={{
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: isOnline ? "#22c55e" : "#555",
      position: "relative",
      zIndex: 2,
    }}
  />

  {/* PULSE EFFECT (only when online) */}
  {isOnline && (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        opacity: 0.6,
        animation: "ping 1.5s infinite",
      }}
    />
  )}
</div>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: "2rem" }}>
          <div>
            <div className="label">Age</div>
            <div>{user.age ?? "—"}</div>

            <div className="label" style={{ marginTop: "1rem" }}>
              Location
            </div>
            <div>{user.location ?? "—"}</div>

            <div className="label" style={{ marginTop: "1rem" }}>
              Joined
            </div>
            <div>{new Date(user.createdAt).toLocaleString()}</div>

            <div className="label" style={{ marginTop: "1rem" }}>
              Last Active
            </div>

            <div>
              {isOnline
                ? "Online now"
                : user.lastActiveAt
                ? getTimeAgo(user.lastActiveAt)
                : "Never"}
            </div>
          </div>

          {/* PHOTOS */}
          <div style={{ flex: 1 }}>
            <div className="label">Photos</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {photos.length > 0 ? (
                photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))
              ) : (
                <div className="glass-card" style={{ padding: "1rem" }}>
                  No photos uploaded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MATCHES */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2 className="h2">Matches</h2>

        {matches.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: "1rem", marginTop: "1rem" }}
          >
            No matches found.
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            {matches.map((m) => (
              <div
                key={m.id}
                className="glass-card"
                style={{
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>
                    {m.otherUserName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--lynq-text-muted)",
                    }}
                  >
                    Matched on{" "}
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>

                <a
                  href={`/admin/users/${m.otherUserId}`}
                  className="btn-gold"
                  style={{ alignSelf: "center" }}
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}