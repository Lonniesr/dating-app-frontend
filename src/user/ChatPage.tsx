import {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
} from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  read: boolean;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isMine(m: Message, meId: string | null) {
  return m.senderId === meId;
}

export default function ChatPage() {

  const { id } = useParams<{ id: string }>();
  const conversationId = id ?? null;

  const API_RAW = import.meta.env.VITE_API_URL || "";
  const API = API_RAW.endsWith("/api") ? API_RAW : `${API_RAW}/api`;

  const { socket } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const {
    data: messages,
    refetch,
  } = useUserChat(conversationId);

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SOCKET EVENTS
  ========================= */

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", { conversationId });

    socket.on("typing:start", () => setIsTyping(true));
    socket.on("typing:stop", () => setIsTyping(false));

    return () => {
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, conversationId]);

  function handleTyping(value: string) {
    setText(value);

    if (!socket || !conversationId) return;

    socket.emit("typing:start", { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId });
    }, 1200);
  }

  /* =========================
     SEND MESSAGE
  ========================= */

  async function sendMessage() {
    if (!text.trim() || !conversationId) return;

    try {

      const url = `${API}/messages/${conversationId}`;

      const res = await axios.post(
        url,
        { text: text.trim() },
        { withCredentials: true }
      );

      console.log("message sent:", res.data);

      setText("");

      await refetch(); // refresh messages immediately

      socket?.emit("typing:stop", { conversationId });

    } catch (err: any) {

      console.error("Send message failed", err);

      if (err.response?.status === 404) {
        console.error(
          "Conversation does not exist in database:",
          conversationId
        );
      }
    }
  }

  const lastMessage =
    (messages?.[messages.length - 1] as Message | undefined) ?? undefined;

  return (
    <div className="flex flex-col h-full bg-black text-white">

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {messages?.map((msg: Message) => {
          const mine = isMine(msg, meId);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-3 ${
                mine ? "justify-end" : "justify-start"
              }`}
              onContextMenu={(e: MouseEvent) => {
                e.preventDefault();
              }}
            >
              <div className="max-w-[70%]">

                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    mine
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-white/10 text-white rounded-bl-none"
                  }`}
                >
                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
                  <span>{formatTime(msg.createdAt)}</span>

                  {mine && msg.read && msg.id === lastMessage?.id && (
                    <span>Seen</span>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="text-xs text-white/40 mt-2">
            Typing…
          </div>
        )}

        <div ref={bottomRef} />

      </div>

      <div className="p-4 border-t border-white/10 flex items-center gap-3">

        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Message..."
          className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/10"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-pink-500 rounded-full"
        >
          Send
        </button>

      </div>

    </div>
  );
}