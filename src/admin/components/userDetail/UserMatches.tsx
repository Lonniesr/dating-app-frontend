interface Match {
  id: string;
  otherUserId: string;
  otherUserName: string | null;
  createdAt: string;
}

interface Props {
  matches?: Match[];
}

export default function UserMatches({ matches = [] }: Props) {
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
          flexWrap: "wrap",
          gap: ".75rem",
        }}
      >
        <h2 className="h2" style={{ margin: 0 }}>
          Match History
        </h2>

        <span
          style={{
            color: "#d4af37",
            fontWeight: 700,
            fontSize: ".95rem",
          }}
        >
          {matches.length} Total
        </span>
      </div>

      {matches.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--lynq-text-muted)",
          }}
        >
          This user has no matches.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className="glass-card"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {match.otherUserName}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    color: "var(--lynq-text-muted)",
                  }}
                >
                  Match ID: {match.id}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    fontSize: ".8rem",
                    color: "#888",
                  }}
                >
                  Matched{" "}
                  {new Date(match.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
              >
                <a
                  href={`/admin/users/${match.otherUserId}`}
                  className="btn-gold"
                  style={{
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  View User
                </a>

                <button
                  className="btn-gold"
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                  }}
                  onClick={() =>
                    console.log(
                      "View Match",
                      match.id
                    )
                  }
                >
                  View Match
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}