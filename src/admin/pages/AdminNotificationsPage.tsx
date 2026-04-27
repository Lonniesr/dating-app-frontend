import { useState } from "react";
import axios from "axios";

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/notifications/broadcast`,
        { message },
        { withCredentials: true } // ✅ required for your auth
      );

      alert("Notification sent to all users 🚀");
      setMessage("");
    } catch (err) {
      console.error("Notification send failed:", err);
      alert("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Notifications
      </h1>

      {/* Composer */}
      <div
        className="glass-panel"
        style={{ padding: "2rem", marginBottom: "2rem" }}
      >
        <h2 className="h2">Send Notification</h2>

        <textarea
          // ❗ REMOVED broken "input" class (this was blocking typing)
          style={{
            width: "100%",
            height: "120px",
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            outline: "none",
          }}
          placeholder="Write a push notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="btn-gold"
          style={{ marginTop: "1rem" }}
          onClick={sendNotification}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* History placeholder */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2 className="h2">Notification History</h2>
        <p style={{ marginTop: "0.5rem" }}>
          This will display previously sent notifications once backend logging
          is added.
        </p>
      </div>
    </div>
  );
}