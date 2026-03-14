import {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
  type ChangeEvent,
} from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { useUserChat } from "./hooks/useUserChat";
import { useChatSocket } from "./hooks/useChatSocket";
import { useUserAuth } from "./context/UserAuthContext";

interface Message {
  id: string;
  text?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  read: boolean;
  imageUrl?: string;
  audioUrl?: string;
  replyToId?: string | null;
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
  const { id } = useParams();
  const conversationIdParam = id;

  const API = import.meta.env.VITE_API_URL;

  const { socket } = useChatSocket();
  const { authUser } = useUserAuth();
  const meId = authUser?.id ?? null;

  const verified = authUser?.verified;

  const [conversationId, setConversationId] = useState<string | null>(null);

  const { data: messages } = useUserChat(conversationId || null);

  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [matchPulse, setMatchPulse] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =========================
     SET CONVERSATION FROM URL
  ========================= */

  useEffect(() => {
    if (conversationIdParam) {
      setConversationId(conversationIdParam);
    }
  }, [conversationIdParam]);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SOCKET EVENTS
  ========================= */

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", { conversationId });

    socket.on("typing:start", () => {
      setIsTyping(true);
    });

    socket.on("typing:stop", () => {
      setIsTyping(false);
    });

    socket.on("user:presence", ({ online }) => {
      setOnline(online);
    });

    return () => {
      socket.off("typing:start");
      socket.off("typing:stop");
      socket.off("user:presence");
    };
  }, [socket, conversationId]);

  function handleTyping(value: string) {
    setText(value);

    if (!socket || !conversationId) return;

    socket.emit("typing:start", { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId });
    }, 1200);
  }

  /* =========================
     SEND MESSAGE
  ========================= */

  async function sendMessage() {
    if (!text.trim() || !conversationId) return;

    try {
      await axios.post(
        `${API}/api/messages/${conversationId}`,
        {
          text: text.trim(),
          imageUrl: imagePreview || undefined,
          audioUrl: audioPreview || undefined,
          replyToId: replyTo?.id,
        },
        { withCredentials: true }
      );

      setText("");
      setImagePreview(null);
      setAudioPreview(null);
      setReplyTo(null);

      socket?.emit("typing:stop", { conversationId });

    } catch (err) {
      console.error("Send message failed", err);
    }
  }

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    if (!verified) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function toggleRecording() {
    if (!verified) return;

    if (!audioPreview) {
      setAudioPreview("/fake-audio.mp3");
    } else {
      setAudioPreview(null);
    }
  }

  function triggerMatchAnimation() {
    setMatchPulse(true);
    setTimeout(() => setMatchPulse(false), 800);
  }

  const lastMessage =
    (messages?.[messages.length - 1] as Message | undefined) ?? undefined;

  return (
    <div className="flex flex-col h-full bg-black text-white">

      <AnimatePresence>
        {matchPulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-500/40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {messages?.map((msg: Message) => {
          const mine = isMine(msg, meId);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
                      src={msg.imageUrl}
                      className="rounded-xl mb-2 max-h-64 object-cover"
                    />
                  )}

                  {msg.audioUrl && (
                    <audio
                      controls
                      src={msg.audioUrl}
                      className="mb-2 w-full"
                    />
                  )}

                  {msg.text && <p>{msg.text}</p>}

                </div>

                <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">

                  <span>{formatTime(msg.createdAt)}</span>

                  {mine && msg.read && msg.id === lastMessage?.id && (
                    <span>Seen</span>
                  )}

                </div>

              </div>

            </motion.div>
          );
        })}

        {isTyping && (
          <div className="text-xs text-white/40 mt-2">
            Typing…
          </div>
        )}

        <div ref={bottomRef} />

      </div>

      <div className="p-4 border-t border-white/10 flex items-center gap-3">

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