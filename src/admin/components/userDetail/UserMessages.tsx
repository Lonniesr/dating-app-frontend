interface MessageItem {
  id: string;
  otherUserName: string;
  lastMessage: string;
  createdAt: string;
}

interface Props {
  user: any;
}

export default function UserMessages({ user }: Props) {
  const conversations: MessageItem[] = user?.conversations ?? [];

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
          Recent Conversations
        </h2>

        <span
          style={{
            color: "#d4af37",
            fontWeight: 700,
          }}
        >
          {conversations.length} Total
        </span>
      </div>

      {conversations.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--lynq-text-muted)",
          }}
        >
          This user has no conversations.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
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
                  {conversation.otherUserName}
                </div>

                <div
                  style={{
                    marginTop: ".35rem",
                    color: "var(--lynq-text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conversation.lastMessage}
                </div>

                <div
                  style={{
                    marginTop: ".5rem",
                    fontSize: ".8rem",
                    color: "#888",
                  }}
                >
                  {new Date(
                    conversation.createdAt
                  ).toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
              >
                <button
                  className="btn-gold"
                  onClick={() =>
                    console.log(
                      "Open conversation:",
                      conversation.id
                    )
                  }
                >
                  Open Chat
                </button>

                <button
                  className="btn-gold"
                  style={{
                    background: "#3b82f6",
                    color: "#fff",
                  }}
                  onClick={() =>
                    console.log(
                      "Message as LynQ Team:",
                      conversation.id
                    )
                  }
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <button
          className="btn-gold"
          onClick={() =>
            console.log(
              "Start admin conversation:",
              user?.id
            )
          }
        >
          New LynQ Team Message
        </button>
      </div>
    </div>
  );
}