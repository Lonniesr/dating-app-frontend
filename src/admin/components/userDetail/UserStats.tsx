interface Props {
  user: any;
}

interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
}

function StatCard({
  title,
  value,
  color = "#d4af37",
}: StatCardProps) {
  return (
    <div
      className="glass-panel"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "1.5rem",
        borderRadius: "16px",
        minHeight: "115px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "all .25s ease",
        cursor: "default",
      }}
    >
      {/* Accent Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 4,
          background: color,
        }}
      />

      <div
        style={{
          fontSize: ".85rem",
          color: "var(--lynq-text-muted)",
          textTransform: "uppercase",
          letterSpacing: ".5px",
          marginBottom: ".6rem",
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "2.25rem",
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </div>
    </div>
  );
}

export default function UserStats({ user }: Props) {
  const stats = [
    {
      title: "Photos",
      value: user?.photos?.length ?? 0,
      color: "#d4af37",
    },
    {
      title: "Matches",
      value: user?.matches?.length ?? 0,
      color: "#ec4899",
    },
    {
      title: "Messages",
      value: user?.messageCount ?? 0,
      color: "#3b82f6",
    },
    {
      title: "Swipes",
      value: user?.swipeCount ?? 0,
      color: "#22c55e",
    },
    {
      title: "Invites",
      value: user?.inviteCount ?? 0,
      color: "#8b5cf6",
    },
    {
      title: "Reports",
      value: user?.reportCount ?? 0,
      color: "#ef4444",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(170px,1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}