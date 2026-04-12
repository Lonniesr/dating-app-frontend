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

  const { socket } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const { data } = useUserChat(userId);
  const messages = data?.messages || [];
  const isBlocked = data?.isBlocked;

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isTyping, setIsTyping] = useState(false); // 🔥 NEW

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length && liveMessages.length === 0) {
      setLiveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  /* 🔥 NEW — READ RECEIPTS */
  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("message:read", { otherUserId: userId });
  }, [socket, userId]);

  /* 🔥 NEW — SOCKET EVENTS */
  useEffect(() => {
    if (!socket) return;

    socket.on("message:read:update", () => {
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === meId
            ? { ...msg, status: "seen" }
            : msg
        )
      );
    });

    socket.on("typing:start", ({ fromUserId }) => {
      if (fromUserId === userId) setIsTyping(true);
    });

    socket.on("typing:stop", ({ fromUserId }) => {
      if (fromUserId === userId) setIsTyping(false);
    });

    return () => {
      socket.off("message:read:update");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, userId, meId]);

  /* =========================
     BLOCK / UNBLOCK
  ========================= */

  async function handleBlockUser() {
    if (!userId) return;

    try {
      await axios.post(
        `${API}/block`,
        { targetId: userId },
        { withCredentials: true }
      );

      window.location.reload();
    } catch (err) {
      console.error("BLOCK FAILED:", err);
    }
  }

  async function handleUnblockUser() {
    if (!userId) return;

    try {
      await axios.delete(
        `${API}/block/${userId}`,
        { withCredentials: true }
      );

      window.location.reload();
    } catch (err) {
      console.error("UNBLOCK FAILED:", err);
    }
  }

  /* =========================
     SEND MESSAGE
  ========================= */

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

        if (error) {
          console.error("UPLOAD ERROR:", error);
          return;
        }

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
            ? {
                ...res.data,
                imageUrl: res.data.imageUrl || imageUrl,
                status: "sent",
              }
            : msg
        )
      );

      setText("");
      setSelectedImage(null);
      setPreview(null);

      socket?.emit("typing:stop", { toUserId: userId }); // 🔥 NEW

    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* 🔥 HEADER WITH BLOCK BUTTON */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="font-semibold">Chat</div>

        {!isBlocked ? (
          <button
            onClick={handleBlockUser}
            className="text-sm text-red-400 hover:text-red-500"
          >
            Block
          </button>
        ) : (
          <button
            onClick={handleUnblockUser}
            className="text-sm text-green-400 hover:text-green-500"
          >
            Unblock
          </button>
        )}
      </div>

      {/* 🔥 BLOCK BANNER */}
      {isBlocked && (
        <div className="bg-red-600 text-center py-2 text-sm">
          You cannot message this user
        </div>
      )}

      {isTyping && ( // 🔥 NEW
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
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    mine ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      className="rounded-lg mb-2 max-h-60 cursor-pointer"
                      onClick={() => window.open(msg.imageUrl, "_blank")}
                    />
                  )}

                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}

                  {mine && ( // 🔥 NEW
                    <>
                      {" "}
                      {msg.status === "sending" && "Sending..."}
                      {msg.status === "sent" && "✓"}
                      {msg.status === "seen" && "✓✓"}
                    </>
                  )}
                </div>
              </div>

              {mine && (
                <img
                  src={getAvatar(authUser)}
                  className="w-8 h-8 rounded-full object-cover"
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

      <div className="p-4 flex items-center gap-2 border-t border-white/10 bg-black">

        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

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

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket?.emit("typing:start", { toUserId: userId }); // 🔥 NEW
          }}
          placeholder={
            isBlocked
              ? "You cannot message this user"
              : "Type a message..."
          }
          disabled={isBlocked}
          className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl outline-none"
          style={{ caretColor: "white" }}
        />

        <button
          onClick={sendMessage}
          disabled={isBlocked}
          className="bg-pink-500 px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Send
        </button>

      </div>
    </div>
  );
}