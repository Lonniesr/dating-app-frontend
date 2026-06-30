interface Props {
  user: any;
  isOnline: boolean;
  getTimeAgo: (date: string) => string;
}

export default function UserHeader({
  user,
  isOnline,
  getTimeAgo,
}: Props) {
  const profilePhoto =
    user?.photos?.[0] ??
    "https://placehold.co/160x160?text=No+Photo";

  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: "2rem",
          rowGap: "2rem",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            position: "relative",
          }}
        >
          <img
            src={profilePhoto}
            alt={user?.name ?? "User"}
            style={{
              width: "160px",
              height: "160px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "4px solid #d4af37",
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "8px",
              bottom: "8px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: isOnline
                ? "#22c55e"
                : "#666",
              border: "3px solid #111",
            }}
          />
        </div>

        {/* User Information */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              columnGap: ".75rem",
              rowGap: ".5rem",
            }}
          >
            <h1
              className="admin-gold-shimmer"
              style={{
                margin: 0,
                fontSize: "2rem",
              }}
            >
              {user?.name || "Unnamed User"}
            </h1>

            {user?.verified && (
              <span
                style={{
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: ".8rem",
                  fontWeight: 700,
                }}
              >
                VERIFIED
              </span>
            )}

            <span
              style={{
                backgroundColor: "#d4af37",
                color: "#111",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: ".8rem",
                fontWeight: 700,
              }}
            >
              {(user?.role || "user").toUpperCase()}
            </span>
          </div>

          <div
            style={{
              marginTop: ".5rem",
              color: "#999",
            }}
          >
            {user?.email}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              columnGap: "1rem",
              rowGap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <div>
              <strong>Username</strong>
              <div>{user?.username || "—"}</div>
            </div>

            <div>
              <strong>Age</strong>
              <div>{user?.age ?? "—"}</div>
            </div>

            <div>
              <strong>Gender</strong>
              <div>{user?.gender ?? "—"}</div>
            </div>

            <div>
              <strong>Location</strong>
              <div>{user?.location ?? "—"}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                {isOnline
                  ? "Online Now"
                  : user?.lastActiveAt
                  ? getTimeAgo(user.lastActiveAt)
                  : "Never"}
              </div>
            </div>

            <div>
              <strong>Joined</strong>
              <div>
                {user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "1.5rem",
            }}
          >
            <strong>User ID</strong>

            <div
              style={{
                marginTop: ".35rem",
                fontSize: ".8rem",
                color: "#999",
                wordBreak: "break-all",
              }}
            >
              {user?.id}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            width: "180px",
            display: "flex",
            flexDirection: "column",
            rowGap: ".75rem",
          }}
        >
          <button
            className="btn-gold"
            onClick={() =>
              console.log("Message", user?.id)
            }
          >
            Message
          </button>

          <button
            className="btn-gold"
            onClick={() =>
              console.log("Verify", user?.id)
            }
          >
            Verify
          </button>

          <button
            className="btn-gold"
            onClick={() =>
              console.log("Ban", user?.id)
            }
          >
            Ban
          </button>

          <button
            className="btn-gold"
            onClick={() =>
              console.log("Delete", user?.id)
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}