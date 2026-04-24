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

type ChatMessage = {
  id: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string; // ✅ added
  senderId: string;
  receiverId: string;
  createdAt: string;
  reactions?: string[];

  sender?: {
    photos?: { url: string }[];
  };
};

function resolvePhotoUrl(photo?: string) {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  const { data } = supabase.storage.from("photos").getPublicUrl(photo);
  return data.publicUrl;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({
  src,
  fallback,
}: {
  src?: string | null;
  fallback: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
      {fallback}
    </div>
  );
}

export default function ChatPage() {
  const { id: otherUserId } = useParams<{ id: string }>();
  const userId = otherUserId ?? null;

  const { socket, ready, joinConversation } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const { data } = useUserChat(userId);

  const messages =
    liveMessages.length === 0
      ? (data?.messages as ChatMessage[]) || []
      : liveMessages;

  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // 🎤 NEW STATE
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickReactions = ["❤️", "😂", "🔥", "👍"];

  useEffect(() => {
    if (data?.messages && liveMessages.length === 0) {
      setLiveMessages(data.messages as ChatMessage[]);
    }
  }, [data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  useEffect(() => {
    if (!socket || !ready || !userId) return;
    joinConversation(userId);
  }, [socket, ready, userId]);

  useEffect(() => {
    if (!socket || !ready) return;

    socket.on("message:new", (msg: ChatMessage) => {
      setLiveMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("message:new");
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

        if (error) {
          console.error("UPLOAD ERROR:", error);
          return;
        }

        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/${userId}`,
        {
          text: text.trim() || null,
          imageUrl,
        },
        { withCredentials: true }
      );

      setLiveMessages((prev) => [...prev, res.data]);

      setText("");
      setSelectedImage(null);
    } catch (err) {
      console.error("SEND FAILED:", err);
    }
  }

  /* =========================
     🎤 MIC FUNCTIONS (ONLY ADDITION)
  ========================= */

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const filePath = `chat-audio/audio-${Date.now()}.webm`;

        const { error } = await supabase.storage
          .from("photos")
          .upload(filePath, blob);

        if (error) {
          console.error("AUDIO UPLOAD ERROR:", error);
          return;
        }

        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/messages/${userId}`,
          {
            text: null,
            audioUrl: data.publicUrl,
          },
          { withCredentials: true }
        );

        setLiveMessages((prev) => [...prev, res.data]);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("MIC ERROR:", err);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => {
          const mine = msg.senderId === meId;

          const photoPath = msg.sender?.photos?.[0]?.url;
          const avatarUrl = resolvePhotoUrl(photoPath);

          return (
            <div
              key={msg.id}
              className={`flex mb-3 items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {!mine && (
                <Avatar src={avatarUrl} fallback="U" />
              )}

              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    mine ? "bg-pink-500" : "bg-white/10"
                  }`}
                >
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} className="mb-2 rounded-lg" />
                  )}

                  {msg.audioUrl && (
                    <audio controls className="mb-2">
                      <source src={msg.audioUrl} type="audio/webm" />
                    </audio>
                  )}

                  {msg.text}
                </div>

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
              </div>

              {mine && (
                <Avatar
                  src={
                    authUser?.photos?.[0]
                      ? resolvePhotoUrl(authUser.photos[0])
                      : null
                  }
                  fallback="ME"
                />
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

        {/* 🎤 UPDATED BUTTON */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          className={recording ? "text-red-500" : ""}
        >
          🎤
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) =>
            setSelectedImage(e.target.files?.[0] || null)
          }
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