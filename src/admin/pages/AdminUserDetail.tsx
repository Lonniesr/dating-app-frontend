import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminUserDetailService } from "../services/adminUserDetailService";
import type { AdminUserDetail } from "../services/adminUserDetailService";

export default function AdminUserDetailPage() {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery<AdminUserDetail>({
    queryKey: ["admin-user-detail", id],
    queryFn: () => adminUserDetailService.get(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="glass-card">Loading user…</div>;
  }

  if (!user) {
    return <div className="glass-card">User not found.</div>;
  }

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
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="h2">{user.name ?? "Unnamed User"}</h2>

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
              {user.lastActiveAt
                ? new Date(user.lastActiveAt).toLocaleString()
                : "—"}
            </div>
          </div>

          {/* PHOTOS */}
          <div style={{ flex: 1 }}>
            <div className="label">Photos</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {user.photos.length > 0 ? (
                user.photos.map((url, i) => (
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

        {user.matches.length === 0 ? (
          <div className="glass-card" style={{ padding: "1rem", marginTop: "1rem" }}>
            No matches found.
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            {user.matches.map((m) => (
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
                  <div style={{ fontWeight: "bold" }}>{m.otherUserName}</div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--lynq-text-muted)",
                    }}
                  >
                    Matched on {new Date(m.createdAt).toLocaleString()}
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
