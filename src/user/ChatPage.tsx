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
import { supabase } from "../lib/supabaseClient";

interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  reactions?: string[];
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const { id: otherUserId } = useParams<{ id: string }>();
  const userId = otherUserId ?? null;

  const API_RAW = import.meta.env.VITE_API_URL || "";
  const API = API_RAW.endsWith("/api") ? API_RAW : `${API_RAW}/api`;

  const { socket, ready, joinConversation } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const { data } = useUserChat(userId);

  const messages =
    liveMessages.length === 0 ? data?.messages || [] : [];

  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickReactions = ["❤️", "😂", "🔥", "👍"];

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
    if (!socket) return;

    const handlePresence = ({ userId, online }: any) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: online,
      }));
    };

    socket.on("presence:update", handlePresence);

    return () => {
      socket.off("presence:update", handlePresence);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !ready) return;

    const handleMessage = (msg: Message) => {
      setLiveMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("message:new", handleMessage);

    return () => {
      socket.off("message:new", handleMessage);
    };
  }, [socket, ready]);

  const addReaction = (messageId: string, emoji: string) => {
    setLiveMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), emoji],
            }
          : msg
      )
    );
  };

  async function sendMessage() {
    if (!text.trim() || !userId) return;

    try {
      const res = await axios.post(
        `${API}/messages/${userId}`,
        { text },
        { withCredentials: true }
      );

      setLiveMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* ONLINE */}
      <div className="text-xs text-green-400 px-4 pt-2">
        {onlineUsers[userId!] ? "Online" : "Offline"}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {liveMessages.map((msg) => {
          const mine = msg.senderId === meId;

          return (
            <div
              key={msg.id}
              className={`flex mb-3 items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {/* LEFT AVATAR */}
              {!mine && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                  U
                </div>
              )}

              {/* MESSAGE */}
              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    mine ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  {msg.text}
                </div>

                {/* REACTIONS */}
                <div className="flex gap-2 mt-1">
                  {msg.reactions?.map((r, i) => (
                    <span key={i}>{r}</span>
                  ))}
                </div>

                {/* QUICK REACTIONS */}
                <div className="flex gap-2 mt-1">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="text-sm opacity-60 hover:opacity-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}
                </div>
              </div>

              {/* RIGHT AVATAR */}
              {mine && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                  ME
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 flex items-center gap-2">
        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

        <button>🎤</button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-[#1a1a1a] px-4 py-3 rounded-xl"
        />

        <button
          onClick={sendMessage}
          className="bg-pink-500 px-4 rounded-xl"
        >
          Send
        </button>
      </div>

    </div>
  );
}