interface Invite {
  id: string;
  code: string;
  createdAt: string;
  expiresAt?: string | null;
  used: boolean;
}

interface Props {
  user: any;
}

export default function UserInvites({ user }: Props) {
  const invites: Invite[] = user?.invites ?? [];

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
          Invite History
        </h2>

        <span
          style={{
            color: "#d4af37",
            fontWeight: 700,
          }}
        >
          {invites.length} Total
        </span>
      </div>

      {invites.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--lynq-text-muted)",
          }}
        >
          No invites have been created.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="glass-card"
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {invite.code}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    color: "var(--lynq-text-muted)",
                    fontSize: ".85rem",
                  }}
                >
                  Created{" "}
                  {new Date(invite.createdAt).toLocaleString()}
                </div>

                {invite.expiresAt && (
                  <div
                    style={{
                      marginTop: ".25rem",
                      fontSize: ".8rem",
                      color: "#888",
                    }}
                  >
                    Expires{" "}
                    {new Date(invite.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>

              <div
                style={{
                  minWidth: "90px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: invite.used
                    ? "#22c55e"
                    : "#f59e0b",
                }}
              >
                {invite.used ? "USED" : "ACTIVE"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}