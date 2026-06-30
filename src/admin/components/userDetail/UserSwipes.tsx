interface Swipe {
  id: string;
  targetName: string;
  liked: boolean;
  superLike?: boolean;
  createdAt: string;
}

interface Props {
  user: any;
}

export default function UserSwipes({ user }: Props) {
  const swipes: Swipe[] = user?.swipes ?? [];

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
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          className="h2"
          style={{
            margin: 0,
          }}
        >
          Swipe History
        </h2>

        <span
          style={{
            color: "#d4af37",
            fontWeight: 700,
          }}
        >
          {swipes.length} Total
        </span>
      </div>

      {swipes.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--lynq-text-muted)",
          }}
        >
          No swipe history available.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          {swipes.map((swipe) => (
            <div
              key={swipe.id}
              className="glass-card"
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: "1rem",
              }}
            >
              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {swipe.targetName}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    color: "var(--lynq-text-muted)",
                    fontSize: ".85rem",
                  }}
                >
                  {swipe.liked
                    ? "Liked"
                    : "Passed"}

                  {swipe.superLike &&
                    " • Super Like"}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    fontSize: ".8rem",
                    color: "#888",
                  }}
                >
                  {new Date(
                    swipe.createdAt
                  ).toLocaleString()}
                </div>
              </div>
                            <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: ".5rem",
                  minWidth: "120px",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    padding: ".45rem .75rem",
                    borderRadius: "999px",
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor: swipe.liked
                      ? "#22c55e"
                      : "#6b7280",
                  }}
                >
                  {swipe.liked ? "LIKE" : "PASS"}
                </span>

                {swipe.superLike && (
                  <span
                    style={{
                      textAlign: "center",
                      padding: ".45rem .75rem",
                      borderRadius: "999px",
                      fontWeight: 700,
                      color: "#111",
                      backgroundColor: "#d4af37",
                    }}
                  >
                    SUPER LIKE
                  </span>
                )}

                <button
                  className="btn-gold"
                  onClick={() =>
                    console.log(
                      "View swipe",
                      swipe.id
                    )
                  }
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}