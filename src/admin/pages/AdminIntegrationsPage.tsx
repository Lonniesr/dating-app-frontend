export default function AdminIntegrationsPage() {
  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Integrations
      </h1>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="h2">Connected Services</h2>
        <p style={{ marginTop: "0.5rem" }}>
          This section will show integrations such as Stripe, SendGrid, Twilio, OAuth providers,
          and webhook endpoints.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2 className="h2">Coming Soon</h2>
        <ul style={{ marginTop: "1rem", lineHeight: "1.8" }}>
          <li>API keys management</li>
          <li>Webhook logs</li>
          <li>OAuth provider configuration</li>
          <li>Third‑party analytics integrations</li>
        </ul>
      </div>
    </div>
  );
}
