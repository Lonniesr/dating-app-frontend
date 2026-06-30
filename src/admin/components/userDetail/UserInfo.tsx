interface Props {
  user: any;
}

interface RowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "1rem",
        padding: ".9rem 0",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <strong
        style={{
          minWidth: 150,
          color: "var(--lynq-text-muted)",
          fontWeight: 600,
        }}
      >
        {label}
      </strong>

      <div
        style={{
          textAlign: "right",
          wordBreak: "break-word",
          flex: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function UserInfo({ user }: Props) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      <h2
        className="h2"
        style={{
          marginBottom: "1.5rem",
        }}
      >
        Account Information
      </h2>

      <InfoRow
        label="Email"
        value={user?.email || "—"}
      />

      <InfoRow
        label="Username"
        value={user?.username || "—"}
      />

      <InfoRow
        label="Age"
        value={user?.age ?? "—"}
      />

      <InfoRow
        label="Gender"
        value={user?.gender ?? "—"}
      />

      <InfoRow
        label="Location"
        value={user?.location ?? "—"}
      />

      <InfoRow
        label="Role"
        value={
          <span
            style={{
              color:
                user?.role === "admin"
                  ? "#d4af37"
                  : "#fff",
              fontWeight: 700,
            }}
          >
            {(user?.role ?? "user").toUpperCase()}
          </span>
        }
      />

      <InfoRow
        label="Verified"
        value={
          <span
            style={{
              color: user?.verified
                ? "#22c55e"
                : "#ef4444",
              fontWeight: 700,
            }}
          >
            {user?.verified
              ? "YES"
              : "NO"}
          </span>
        }
      />

      <InfoRow
        label="Bio"
        value={user?.bio || "No bio provided"}
      />

      <InfoRow
        label="Joined"
        value={
          user?.createdAt
            ? new Date(
                user.createdAt
              ).toLocaleString()
            : "—"
        }
      />

      <InfoRow
        label="Last Active"
        value={
          user?.lastActiveAt
            ? new Date(
                user.lastActiveAt
              ).toLocaleString()
            : "Never"
        }
      />

      <InfoRow
        label="User ID"
        value={
          <span
            style={{
              fontFamily: "monospace",
              fontSize: ".82rem",
              color: "#999",
            }}
          >
            {user?.id}
          </span>
        }
      />
    </div>
  );
}