interface Props {
  user: any;
}

interface ActionButtonProps {
  title: string;
  subtitle?: string;
  color?: string;
  onClick?: () => void;
}

function ActionButton({
  title,
  subtitle,
  color = "#d4af37",
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "1rem",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        background: color,
        color: "#111",
        textAlign: "left",
        transition: "all .2s ease",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: ".35rem",
            fontSize: ".8rem",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      )}
    </button>
  );
}

export default function UserModeration({ user }: Props) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Moderation Tools
        </h2>

        <span
          style={{
            color: user?.banned ? "#ef4444" : "#22c55e",
            fontWeight: 700,
          }}
        >
          {user?.banned ? "BANNED" : "ACTIVE"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "1rem",
        }}
      >
        <ActionButton
          title={
            user?.verified
              ? "Remove Verification"
              : "Verify User"
          }
          subtitle="Manage verification status"
          onClick={() =>
            console.log("Verify:", user.id)
          }
        />

        <ActionButton
          title="Send Message"
          subtitle="Message user as LynQ Team"
          color="#3b82f6"
          onClick={() =>
            console.log("Message:", user.id)
          }
        />

        <ActionButton
          title="Reset Password"
          subtitle="Send password reset email"
          color="#8b5cf6"
          onClick={() =>
            console.log("Reset password:", user.id)
          }
        />

        <ActionButton
          title="Copy Email"
          subtitle={user?.email}
          color="#14b8a6"
          onClick={() =>
            navigator.clipboard.writeText(
              user?.email ?? ""
            )
          }
        />

        <ActionButton
          title="Copy User ID"
          subtitle="Copy UUID"
          color="#06b6d4"
          onClick={() =>
            navigator.clipboard.writeText(
              user?.id ?? ""
            )
          }
        />

        <ActionButton
          title={user?.banned ? "Unban User" : "Ban User"}
          subtitle="Prevent account access"
          color="#f59e0b"
          onClick={() =>
            console.log("Ban:", user.id)
          }
        />

        <ActionButton
          title="Shadow Ban"
          subtitle="Hide user without notifying them"
          color="#ef4444"
          onClick={() =>
            console.log("Shadow Ban:", user.id)
          }
        />

        <ActionButton
          title="Delete Account"
          subtitle="Permanent action"
          color="#b91c1c"
          onClick={() =>
            console.log("Delete:", user.id)
          }
        />
      </div>
    </div>
  );
}