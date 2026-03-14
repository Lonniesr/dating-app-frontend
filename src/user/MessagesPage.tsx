import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  createdAt: string;
};

export default function MessagesPage() {
  const { matchId } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  /* ===============================
     LOAD CONVERSATION + MESSAGES
  =============================== */

  async function loadMessages() {
    try {
      if (!matchId) return;

      /* STEP 1 — GET OR CREATE CONVERSATION */

      const convoRes = await fetch(
        `${API}/api/conversations/${matchId}`,
        { credentials: "include" }
      );

      if (!convoRes.ok) {
        throw new Error("Failed to load conversation");
      }

      const conversation = await convoRes.json();

      if (!conversation?.id) {
        throw new Error("Conversation ID missing");
      }

      setConversationId(conversation.id);

      /* STEP 2 — LOAD MESSAGES */

      const msgRes = await fetch(
        `${API}/api/messages/${conversation.id}`,
        { credentials: "include" }
      );

      const data = await msgRes.json();

      if (Array.isArray(data)) {
        setMessages(data);
      }

      setLoading(false);

    } catch (err) {
      console.error("LOAD MESSAGES ERROR:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [matchId]);

  /* ===============================
     SEND MESSAGE
  =============================== */

  async function sendMessage() {
    if (!input.trim() || !conversationId) return;

    try {
      const res = await fetch(
        `${API}/api/messages/${conversationId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: input,
          }),
        }
      );

      const message = await res.json();

      setMessages((prev) => [...prev, message]);
      setInput("");

    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);
    }
  }

  /* ===============================
     UI
  =============================== */

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">

      {/* MESSAGE LIST */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 && (
          <p className="text-white/50">
            No messages yet. Say hello 👋
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white/10 p-3 rounded-lg max-w-xs"
          >
            {msg.text}
          </div>
        ))}

      </div>

      {/* MESSAGE INPUT */}

      <div className="p-4 border-t border-white/10 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 rounded-lg px-3 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
        >
          Send
        </button>

      </div>

    </div>
  );
}