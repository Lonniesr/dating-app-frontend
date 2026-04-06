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
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
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
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =========================
     SYNC MESSAGES (SAFE)
  ========================= */

  useEffect(() => {
    if (messages && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  /* =========================
     SOCKET (NO DUPLICATES)
  ========================= */

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("conversation:join", { otherUserId: userId });

    socket.on("typing:start", () => setIsTyping(true));
    socket.on("typing:stop", () => setIsTyping(false));

    return () => {
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, userId]);

  /* =========================
     TYPING
  ========================= */

  function handleTyping(value: string) {
    setText(value);

    if (!socket || !userId) return;

    socket.emit("typing:start", { toUserId: userId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { toUserId: userId });
    }, 1200);
  }

  /* =========================
     IMAGE HANDLING
  ========================= */

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setSelectedImage(null);
    setPreview(null);
  }

  /* =========================
     SEND MESSAGE (FIXED UX)
  ========================= */

  async function sendMessage() {
    if ((!text.trim() && !selectedImage) || !userId) return;

    try {
      let imageUrl: string | null = null;

      /* STEP 1: Upload image */
      if (selectedImage) {
        const uploadData = new FormData();
        uploadData.append("image", selectedImage);

        const uploadRes = await axios.post(
          `${API}/upload/chat`,
          uploadData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("UPLOAD RESPONSE:", uploadRes.data);

        if (!uploadRes.data?.url) {
          throw new Error("Upload failed — no URL returned");
        }

        imageUrl = uploadRes.data.url;
      }

      /* 🔥 OPTIMISTIC MESSAGE */
      const tempMessage: Message = {
        id: "temp-" + Date.now(),
        text: text.trim() || undefined,
        imageUrl: imageUrl || undefined,
        senderId: meId!,
        receiverId: userId!,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setLiveMessages((prev) => [...prev, tempMessage]);

      console.log("FINAL MESSAGE PAYLOAD:", {
        text: text.trim(),
        imageUrl,
        replyToId: replyTo?.id,
      });

      /* STEP 2: Send message */
      const res = await axios.post(
        `${API}/messages/${userId}`,
        {
          text: text.trim() || null,
          imageUrl,
          replyToId: replyTo?.id || null,
        },
        { withCredentials: true }
      );

      /* 🔥 REPLACE TEMP MESSAGE */
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? res.data : msg
        )
      );

      setText("");
      setReplyTo(null);
      removeImage();

      socket?.emit("typing:stop", { toUserId: userId });

    } catch (err: any) {
      console.error("Send message failed", err);
    }
  }

  /* =========================
     READ RECEIPTS
  ========================= */

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("message:read", {
      otherUserId: userId,
    });
  }, [socket, userId, liveMessages]);

  const lastMessage =
    liveMessages?.[liveMessages.length - 1];

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20" />
        <div>
          <p className="text-sm font-semibold">Chat</p>
          <p className="text-xs text-white/40">
            {isTyping ? "Typing..." : "Online"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {liveMessages?.map((msg: Message) => {
          const mine = isMine(msg, meId);

          return (
            <motion.div
              key={msg.id}
              className={`flex mb-3 ${
                mine ? "justify-end" : "justify-start"
              }`}
              onContextMenu={(e: MouseEvent) => {
                e.preventDefault();
                setReplyTo(msg);
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
                  {msg.imageUrl && (
                    <img
                      src={
                        msg.imageUrl.startsWith("http")
                          ? msg.imageUrl
                          : `${API_RAW}${msg.imageUrl}`
                      }
                      className="rounded-lg mb-2 max-h-60"
                    />
                  )}

                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className="text-[10px] text-white/40 mt-1 flex gap-2">
                  <span>{formatTime(msg.createdAt)}</span>

                  {mine &&
                    msg.read &&
                    msg.id === lastMessage?.id && (
                      <span>Seen</span>
                    )}
                </div>

              </div>
            </motion.div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="px-4 py-2">
          <div className="relative w-32">
            <img src={preview} className="rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/70 px-2 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3">

        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-white/60 text-xl"
        >
          📎
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />

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