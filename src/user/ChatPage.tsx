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

  // 🎤 AUDIO
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
     SOCKET
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
    }, 2000);
  }

  /* =========================
     IMAGE
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
     🎤 AUDIO RECORDING
  ========================= */

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("image", blob);

      const res = await axios.post(`${API}/upload/chat`, formData, {
        withCredentials: true,
      });

      await axios.post(
        `${API}/messages/${userId}`,
        {
          audioUrl: res.data.url,
        },
        { withCredentials: true }
      );
    };

    mediaRecorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

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
      removeImage();

    } catch (err) {
      console.error(err);
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

    setLiveMessages((prev) =>
      prev.map((msg) =>
        msg.senderId !== meId ? { ...msg, read: true, status: "seen" } : msg
      )
    );
  }, [socket, userId]);

  const lastMessage = liveMessages[liveMessages.length - 1];

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* MESSAGES */}
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

                  {msg.audioUrl && (
                    <audio controls src={`${API_RAW}${msg.audioUrl}`} />
                  )}

                  {msg.text && <p>{msg.text}</p>}
                </div>

                <div className="text-xs text-white/40 mt-1">
                  {formatTime(msg.createdAt)}{" "}
                  {mine && msg.id === lastMessage?.id && (
                    <span>
                      {msg.read
                        ? "✓✓ Seen"
                        : msg.status === "sending"
                        ? "⏳"
                        : "✓"}
                    </span>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 flex gap-2">

        <button onClick={() => fileInputRef.current?.click()}>📎</button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleImageSelect}
          className="hidden"
        />

        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          className="flex-1"
        />

        <button onClick={sendMessage}>Send</button>

        {/* 🎤 MIC BUTTON */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
        >
          {recording ? "🔴" : "🎤"}
        </button>

      </div>
    </div>
  );
}