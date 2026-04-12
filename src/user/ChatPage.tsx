// 🔥 ONLY ADDITIONS MARKED — EVERYTHING ELSE IS YOUR CODE

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

  const { socket, ready } = useChatSocket(); // 🔥 FIXED
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const { data } = useUserChat(userId);
  const messages = data?.messages || [];
  const isBlocked = data?.isBlocked;

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isTyping, setIsTyping] = useState(false);

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

  /* 🔥 FIXED — JOIN ROOM (WAIT FOR READY) */
  useEffect(() => {
    if (!socket || !ready || !userId) return;

    socket.emit("conversation:join", { otherUserId: userId });
    console.log("🔥 Joined conversation:", userId);
  }, [socket, ready, userId]);

  /* 🔥 FIXED — READ RECEIPTS */
  useEffect(() => {
    if (!socket || !ready || !userId) return;

    socket.emit("message:read", { otherUserId: userId });
  }, [socket, ready, userId]);

  /* 🔥 FIXED — SOCKET EVENTS */
  useEffect(() => {
    if (!socket || !ready) return;

    socket.on("message:new", (msg) => {
      setLiveMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("message:read:update", () => {
      setLiveMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === meId
            ? { ...msg, status: "seen", read: true }
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
      socket.off("message:new");
      socket.off("message:read:update");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, ready, userId, meId]);

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

      socket?.emit("typing:stop", { toUserId: userId });

    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* UI unchanged */}
    </div>
  );
}