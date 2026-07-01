import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  user: any;
}

interface ActionButtonProps {
  title: string;
  subtitle?: string;
  color?: string;
  onClick?: () => void;
}

function ActionButton({
  title,
  subtitle,
  color = "#d4af37",
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "1rem",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        background: color,
        color: "#111",
        textAlign: "left",
        transition: "all .2s ease",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: ".35rem",
            fontSize: ".8rem",
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      )}
    </button>
  );
}

export default function UserModeration({ user }: Props) {

  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

const [verifying, setVerifying] = useState(false);

const [banning, setBanning] = useState(false);

const queryClient = useQueryClient();

  async function sendMessage() {
    if (!message.trim()) return;

    try {
      setSending(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/messages/user`,
        {
          userId: user.id,
          message,
        },
        {
          withCredentials: true,
        }
      );

      alert("Message sent successfully.");

      setMessage("");
      setMessageOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  }
  async function toggleVerification() {
    try {
      setVerifying(true);

      const endpoint = user.verified ? "remove" : "approve";

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/verification/${user.id}/${endpoint}`,
        {},
        {
          withCredentials: true,
        }
      );

      alert(
        user.verified
          ? "Verification removed."
          : "User verified."
      );

      await queryClient.invalidateQueries({
        queryKey: ["admin-user-detail", user.id],
      });

    } catch (err) {
      console.error(err);
      alert("Verification update failed.");
    } finally {
      setVerifying(false);
    }
  }

async function toggleBan() {
  try {
    setBanning(true);

    if (user.banned) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/bans/${user.id}`,
        {
          withCredentials: true,
        }
      );

      alert("User unbanned.");
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/bans/${user.id}`,
        {
          reason: "Banned by administrator",
          durationHours: null,
        },
        {
          withCredentials: true,
        }
      );

      alert("User banned.");
    }

    await queryClient.invalidateQueries({
      queryKey: ["admin-user-detail", user.id],
    });

  } catch (err) {
    console.error(err);
    alert("Failed to update ban status.");
  } finally {
    setBanning(false);
  }
}

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
          Moderation Tools
        </h2>

        <span
          style={{
            color: user?.banned ? "#ef4444" : "#22c55e",
            fontWeight: 700,
          }}
        >
          {user?.banned ? "BANNED" : "ACTIVE"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "1rem",
        }}
      >
        <ActionButton
  title={
    verifying
      ? "Updating..."
      : user?.verified
      ? "Remove Verification"
      : "Verify User"
  }
  subtitle="Manage verification status"
  onClick={toggleVerification}
/>

        <ActionButton
        title="Send Message"
        subtitle="Message user as LynQ Team"
        color="#3b82f6"
        onClick={() => setMessageOpen(true)}
/>


        <ActionButton
          title="Reset Password"
          subtitle="Send password reset email"
          color="#8b5cf6"
          onClick={() =>
            console.log("Reset password:", user.id)
          }
        />

        <ActionButton
          title="Copy Email"
          subtitle={user?.email}
          color="#14b8a6"
          onClick={() =>
            navigator.clipboard.writeText(
              user?.email ?? ""
            )
          }
        />

        <ActionButton
          title="Copy User ID"
          subtitle="Copy UUID"
          color="#06b6d4"
          onClick={() =>
            navigator.clipboard.writeText(
              user?.id ?? ""
            )
          }
        />

      <ActionButton
  title={
    banning
      ? "Updating..."
      : user?.banned
      ? "Unban User"
      : "Ban User"
  }
  subtitle="Prevent account access"
  color="#f59e0b"
  onClick={toggleBan}
/> 

        <ActionButton
          title="Shadow Ban"
          subtitle="Hide user without notifying them"
          color="#ef4444"
          onClick={() =>
            console.log("Shadow Ban:", user.id)
          }
        />

               <ActionButton
          title="Delete Account"
          subtitle="Permanent action"
          color="#b91c1c"
          onClick={() =>
            console.log("Delete:", user.id)
          }
        />
      </div>

      {messageOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "95%",
              maxWidth: "650px",
              padding: "2rem",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Message as LynQ Team
            </h2>

            <p
              style={{
                color: "#999",
                marginBottom: "1rem",
              }}
            >
              Sending to{" "}
              <strong>
                {user.name || user.email}
              </strong>
            </p>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Type your message..."
              rows={8}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #444",
                background: "#111",
                color: "#fff",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setMessageOpen(false)}
                disabled={sending}
              >
                Cancel
              </button>

              <button
                className="btn-gold"
                onClick={sendMessage}
                disabled={sending}
              >
                {sending
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 