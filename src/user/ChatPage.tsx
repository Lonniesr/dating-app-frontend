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

function isMine(m: Message, meId: string | null) {
  return m.senderId === meId;
}

// ✅ always works
function getAvatar(id?: string) {
  return `https://ui-avatars.com/api/?background=222&color=fff&name=${id?.slice(0,2) || "U"}`;
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
  const [preview, setPreview] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =========================
     REACTIONS
  ========================= */

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

  const quickReactions = ["❤️", "😂", "🔥", "👍"];

  /* ========================= */

  useEffect(() => {
    if (messages.length && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  /* =========================
     JOIN
  ========================= */

  useEffect(() => {
    if (!socket || !ready || !userId) return;
    joinConversation(userId);
  }, [socket, ready, userId]);

  /* =========================
     ONLINE
  ========================= */

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

  /* =========================
     SOCKET MESSAGES
  ========================= */

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

  async function sendMessage() {
    if ((!text.trim() && !selectedImage) || !userId) return;

    try {
      let imageUrl: string | null = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `chat-images/${fileName}`;

        const { error } = await supabase.storage
          .from("photos")
          .upload(filePath, selectedImage);

        if (error) return;

        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const res = await axios.post(
        `${API}/messages/${userId}`,
        {
          text: text.trim() || null,
          imageUrl,
        },
        { withCredentials: true }
      );

      setLiveMessages((prev) => [...prev, res.data]);

      setText("");
      setSelectedImage(null);
      setPreview(null);

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

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {liveMessages.map((msg) => {
          const mine = isMine(msg, meId);

          return (
            <div key={msg.id} className={`mb-3 ${mine ? "text-right" : "text-left"}`}>

              <div className={`inline-block px-4 py-2 rounded-2xl ${
                mine ? "bg-pink-500" : "bg-white/10"
              }`}>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} className="mb-2 rounded-lg" />
                )}
                {msg.text}
              </div>

              {/* reactions */}
              <div className="flex gap-2 mt-1">
                {msg.reactions?.map((r, i) => (
                  <span key={i}>{r}</span>
                ))}
              </div>

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

              {/* avatars */}
              <div className="flex mt-1">
                {!mine && (
                  <img
                    src={getAvatar(msg.senderId)}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {mine && (
                  <img
                    src={getAvatar(meId!)}
                    className="w-8 h-8 rounded-full ml-auto"
                  />
                )}
              </div>

            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex items-center gap-2">
        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

        <button>🎤</button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedImage(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
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