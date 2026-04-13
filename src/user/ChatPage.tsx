import {
  useState,
  useEffect,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import { useUserChat } from "./hooks/useUserChat";
import { useChatSocket } from "./hooks/useChatSocket";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";

interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  status?: "sending" | "sent" | "seen";
  replyTo?: Message | null;
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

function getAvatar(user?: any) {
  return (
    user?.photoUrl ||
    user?.photos?.[0] ||
    "https://ui-avatars.com/api/?background=222&color=fff&name=U"
  );
}

export default function ChatPage() {
  const { id: otherUserId } = useParams<{ id: string }>();
  const userId = otherUserId ?? null;

  const API_RAW = import.meta.env.VITE_API_URL || "";
  const API = API_RAW.endsWith("/api") ? API_RAW : `${API_RAW}/api`;

  const { socket, ready } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  // ✅ MOVED THIS UP (ONLY CHANGE)
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const { data } = useUserChat(userId);

  const messages =
    liveMessages.length === 0 ? data?.messages || [] : [];

  const isBlocked = data?.isBlocked;

  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTypingRef = useRef(false);

  useEffect(() => {
    if (messages.length && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (!isTypingRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveMessages]);

  useEffect(() => {
    if (!socket || !ready || !userId) return;
    socket.emit("conversation:join", { otherUserId: userId });
  }, [socket, ready, userId]);

  useEffect(() => {
    if (!socket || !ready || !userId) return;
    socket.emit("message:read", { otherUserId: userId });
  }, [socket, ready, userId]);

  useEffect(() => {
    if (!socket || !ready) return;

    const handleMessage = (msg: Message) => {
      setLiveMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    const handleRead = () => {
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === meId
            ? { ...msg, status: "seen", read: true }
            : msg
        )
      );
    };

    const handleTypingStart = () => {
      setIsTyping(true);
    };

    const handleTypingStop = () => {
      setIsTyping(false);
    };

    socket.on("message:new", handleMessage);
    socket.on("message:read:update", handleRead);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:new", handleMessage);
      socket.off("message:read:update", handleRead);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };

  }, [socket, ready]);

  async function sendMessage() {
    if ((!text.trim() && !selectedImage) || !userId || isBlocked) return;

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

      const tempMessage: Message = {
        id: "temp-" + Date.now(),
        text: text.trim() || undefined,
        imageUrl: imageUrl || undefined,
        senderId: meId!,
        receiverId: userId!,
        createdAt: new Date().toISOString(),
        read: false,
        status: "sending",
      };

      setLiveMessages((prev) => [...prev, tempMessage]);

      const res = await axios.post(
        `${API}/messages/${userId}`,
        {
          text: text.trim() || null,
          imageUrl,
        },
        { withCredentials: true }
      );

      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...res.data, status: "sent" }
            : msg
        )
      );

      setText("");
      setSelectedImage(null);
      setPreview(null);

      socket?.emit("typing:stop", { to: userId, fromUserId: meId });

    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {isTyping && (
        <div className="text-sm text-white/40 px-4 pt-2">
          typing...
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {liveMessages.map((msg) => {
          const mine = isMine(msg, meId);

          return (
            <motion.div
              key={msg.id}
              className={`flex mb-3 items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {!mine && (
                <img
                  src="https://ui-avatars.com/api/?background=333&color=fff&name=U"
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div className="max-w-[70%]">
                <div className={`px-4 py-2 rounded-2xl ${mine ? "bg-pink-500" : "bg-white/10"}`}>
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} className="mb-2 rounded-lg" />
                  )}
                  {msg.text}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}
                  {mine && (
                    <>
                      {msg.status === "sending" && " Sending..."}
                      {msg.status === "sent" && " ✓"}
                      {(msg.status === "seen" || msg.read) && " ✓✓"}
                    </>
                  )}
                </div>
              </div>

              {mine && (
                <img
                  src={getAvatar(authUser)}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {preview && (
        <div className="px-4 pb-2">
          <img src={preview} className="max-h-40 rounded-lg" />
        </div>
      )}

      <div className="p-4 flex items-center gap-2">
        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

        <button>🎤</button>
        <button>😊</button>

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
          onChange={(e) => {
            setText(e.target.value);

            isTypingRef.current = true;

            if (!(window as any).isTyping) {
              (window as any).isTyping = true;

              socket?.emit("typing:start", {
                to: userId,
                fromUserId: meId,
              });
            }

            clearTimeout((window as any).typingTimeout);

            (window as any).typingTimeout = setTimeout(() => {
              (window as any).isTyping = false;
              isTypingRef.current = false;

              socket?.emit("typing:stop", {
                to: userId,
                fromUserId: meId,
              });
            }, 1000);
          }}
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