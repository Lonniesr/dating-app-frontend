import {
  useState,
  useEffect,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useUserChat } from "./hooks/useUserChat";
import { useChatSocket } from "./hooks/useChatSocket";
import { useUserAuth } from "./context/UserAuthContext";

interface Message {
  id: string;
  text?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({
  src,
  fallback,
}: {
  src?: string | null;
  fallback: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
      {fallback}
    </div>
  );
}

export default function ChatPage() {
  const { id: otherUserId } = useParams<{ id: string }>();
  const userId = otherUserId ?? null;

  const { socket, ready, joinConversation } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const { data } = useUserChat(userId);

  const messages =
    liveMessages.length === 0 ? data?.messages || [] : [];

  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  useEffect(() => {
    if (!socket || !ready || !userId) return;
    joinConversation(userId);
  }, [socket, ready, userId]);

  useEffect(() => {
    if (!socket || !ready) return;

    socket.on("message:new", (msg: Message) => {
      setLiveMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("message:new");
    };
  }, [socket, ready]);

  async function sendMessage() {
    if (!text.trim() || !userId) return;

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/messages/${userId}`,
      { text },
      { withCredentials: true }
    );

    setLiveMessages((prev) => [...prev, res.data]);
    setText("");
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => {
          const mine = msg.senderId === meId;

          return (
            <div
              key={msg.id}
              className={`flex mb-3 items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {/* OTHER USER */}
              {!mine && (
                <Avatar
                  src={null}
                  fallback="U"
                />
              )}

              {/* MESSAGE */}
              <div className="max-w-[70%]">
                <div className={`px-4 py-2 rounded-2xl ${
                  mine ? "bg-pink-500" : "bg-white/10"
                }`}>
                  {msg.text}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}
                </div>
              </div>

              {/* ME */}
              {mine && (
                <Avatar
                  src={authUser?.photoUrl || null}
                  fallback="ME"
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-[#1a1a1a] px-4 py-3 rounded-xl"
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}