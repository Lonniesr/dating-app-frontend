export default function AdminBillingPage() {
  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Billing & Subscriptions
      </h1>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="h2">Overview</h2>
        <p style={{ marginTop: "0.5rem" }}>
          This section will integrate with your billing provider (Stripe, RevenueCat, etc.)
          to show subscription metrics, revenue, and user purchase history.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2 className="h2">Coming Soon</h2>
        <ul style={{ marginTop: "1rem", lineHeight: "1.8" }}>
          <li>Monthly recurring revenue (MRR)</li>
          <li>Active subscriptions</li>
          <li>Failed payments</li>
          <li>Refunds</li>
          <li>User purchase history</li>
        </ul>
      </div>
    </div>
  );
}
