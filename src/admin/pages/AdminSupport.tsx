import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/admin/support",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(res.data?.tickets)) {
          setTickets(res.data.tickets);
        } else {
          setTickets([]);
        }
      } catch (err) {
        setError("Failed to load support tickets.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function sendReply(ticketId: string) {
    try {
      setSending(true);
      setSendResult("");

      const token = localStorage.getItem("adminToken");

      await axios.post(
        import.meta.env.VITE_API_URL + `/api/admin/support/${ticketId}/reply`,
        { message: replyMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSendResult("Reply sent.");
      setReplyMessage("");
      setReplyingTo(null);
    } catch (err) {
      setSendResult("Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading support tickets…
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Support Tickets</h1>

      {tickets.length === 0 && (
        <div className="text-gray-500">No support tickets found.</div>
      )}

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="font-medium">
              {ticket.subject || "Support Ticket"}
            </div>

            <div className="text-sm text-gray-600 mt-1">
              From: {ticket.email || "Unknown"}
            </div>

            <div className="text-sm text-gray-600 mt-2">
              {ticket.message || ""}
            </div>

            <div className="text-xs text-gray-400 mt-2">
              {ticket.timestamp
                ? new Date(ticket.timestamp).toLocaleString()
                : ""}
            </div>

            {replyingTo === ticket.id ? (
              <div className="mt-4 space-y-2">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-24"
                />

                <button
                  onClick={() => sendReply(ticket.id)}
                  disabled={sending || !replyMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded shadow"
                >
                  {sending ? "Sending…" : "Send Reply"}
                </button>

                {sendResult && (
                  <div className="text-sm text-gray-600">{sendResult}</div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(ticket.id)}
                className="mt-3 px-4 py-2 bg-gray-800 text-white rounded shadow"
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
