import {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
} from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import { useUserChat } from "./hooks/useUserChat";
import { useChatSocket } from "./hooks/useChatSocket";
import { useUserAuth } from "./context/UserAuthContext";

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

export default function ChatPage() {
  const { id: otherUserId } = useParams<{ id: string }>();
  const userId = otherUserId ?? null;

  const API_RAW = import.meta.env.VITE_API_URL || "";
  const API = API_RAW.endsWith("/api") ? API_RAW : `${API_RAW}/api`;

  const { socket } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const { data: messages } = useUserChat(userId);

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (messages && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  /* =========================
     SEND MESSAGE (FIXED)
  ========================= */

  async function sendMessage() {
    console.log("🔥 SEND MESSAGE TRIGGERED");

    if ((!text.trim() && !selectedImage) || !userId) {
      console.log("❌ BLOCKED: empty message or no user");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (selectedImage) {
        console.log("📤 Uploading image...");

        const uploadData = new FormData();
        uploadData.append("image", selectedImage);

        const uploadRes = await axios.post(
          `${API}/upload/chat`,
          uploadData,
          { withCredentials: true }
        );

        imageUrl = uploadRes.data.url;
      }

      console.log("📨 Sending message to API...");

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

      console.log("✅ MESSAGE SENT:", res.data);

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

    } catch (err) {
      console.error("❌ SEND FAILED:", err);
    }
  }

  /* =========================
     INPUT
  ========================= */

  return (
    <div className="flex flex-col h-full bg-black text-white">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {liveMessages.map((msg) => {
          const mine = isMine(msg, meId);

          return (
            <motion.div key={msg.id} className={`flex mb-3 ${mine ? "justify-end" : ""}`}>
              <div className="max-w-[70%]">

                <div className={`px-4 py-2 rounded-2xl ${mine ? "bg-pink-500" : "bg-white/10"}`}>
                  {msg.imageUrl && (
                    <img
                      src={`${API_RAW}${msg.imageUrl}`}
                      className="rounded-lg mb-2"
                    />
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}
                </div>

              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 flex gap-2">

        <button onClick={() => fileInputRef.current?.click()}>📎</button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedImage(file);
          }}
          className="hidden"
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />

        {/* 🔥 FIXED BUTTON */}
        <button
          onClick={() => {
            console.log("🔥 BUTTON CLICKED");
            sendMessage();
          }}
        >
          Send
        </button>

      </div>
    </div>
  );
}