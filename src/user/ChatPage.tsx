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

/* 🔥 FIX: image resolver */
function resolveImage(url?: string, API_RAW?: string) {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  return `${API_RAW}${url.startsWith("/") ? "" : "/"}${url}`;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  /* =========================
     SEND MESSAGE
  ========================= */

  async function sendMessage() {
    if ((!text.trim() && !selectedImage) || !userId) return;

    try {
      let imageUrl: string | null = null;

      if (selectedImage) {
        const uploadData = new FormData();
        uploadData.append("image", selectedImage);

        const uploadRes = await axios.post(
          `${API}/upload/chat`,
          uploadData,
          { withCredentials: true }
        );

        imageUrl = uploadRes.data.url;
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

    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* MESSAGES */}
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
              {/* OTHER USER */}
              {!mine && (
                <img
                  src={"/default-avatar.png"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    mine ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  {/* ✅ FIXED IMAGE */}
                  {msg.imageUrl && (
                    <img
                      src={resolveImage(msg.imageUrl, API_RAW)}
                      className="rounded-lg mb-2 max-h-60"
                    />
                  )}

                  {/* TEXT + REACTIONS */}
                  {msg.text && (
                    <div className="relative group">
                      <p>{msg.text}</p>

                      <div className="absolute -top-6 hidden group-hover:flex gap-1 bg-black px-2 py-1 rounded">
                        {["❤️", "😂", "🔥"].map((emoji) => (
                          <button key={emoji}>{emoji}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}
                </div>
              </div>

              {/* YOU */}
              {mine && (
                <img
                  src={"/default-avatar.png"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="px-4 pb-2">
          <img
            src={preview}
            className="max-h-40 rounded-lg"
          />
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-4 flex items-center gap-2 border-t border-white/10 bg-black">

        {/* FILE */}
        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

        {/* MIC */}
        <button className="text-xl">🎤</button>

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

        {/* INPUT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl outline-none"
          style={{ caretColor: "white" }}
        />

        {/* SEND */}
        <button
          onClick={sendMessage}
          className="bg-pink-500 px-4 py-2 rounded-xl"
        >
          Send
        </button>

      </div>
    </div>
  );
}