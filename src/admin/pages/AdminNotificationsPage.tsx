import { useState } from "react";

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    alert("This will send a real notification once backend is connected.");
    setMessage("");
  };

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Notifications
      </h1>

      {/* Composer */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="h2">Send Notification</h2>

        <textarea
          className="input"
          style={{ width: "100%", height: "120px", marginTop: "1rem" }}
          placeholder="Write a push notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="btn-gold"
          style={{ marginTop: "1rem" }}
          onClick={sendNotification}
        >
          Send
        </button>
      </div>

      {/* History placeholder */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2 className="h2">Notification History</h2>
        <p style={{ marginTop: "0.5rem" }}>
          This will display previously sent notifications once backend logging is added.
        </p>
      </div>
    </div>
  );
}
