export default function MetricCardGlass({ label, value }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <span style={{ color: "var(--lynq-text-muted)", fontSize: "0.9rem" }}>
        {label}
      </span>

      <span
        style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          color: "var(--lynq-gold)",
          textShadow: "0 0 12px var(--lynq-gold-glow)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
