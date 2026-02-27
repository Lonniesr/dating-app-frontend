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
import { useUserAuth } from "./context/useUserAuth";
/* -------------------------------------------------------------------------- */
/*                               Types & helpers                              */
/* -------------------------------------------------------------------------- */

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

function isMine(m: Message, meId: string | null, otherId: string | undefined) {
  if (!meId) return m.senderId !== otherId;
  return m.senderId === meId;
}

/* -------------------------------------------------------------------------- */
/*                                ChatHeader UI                               */
/* -------------------------------------------------------------------------- */

function ChatHeader({
  isTyping,
  online,
  onMatchAnimation,
}: {
  isTyping: boolean;
  online: boolean;
  onMatchAnimation: () => void;
}) {
  return (
    <div className="p-4 flex items-center gap-3 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-xl z-10">
      <div className="relative">
        <motion.img
          src="/placeholder.jpg"
          className="w-10 h-10 rounded-full object-cover"
          whileTap={{ scale: 0.95 }}
        />
        <span
          className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border border-black ${
            online ? "bg-green-400" : "bg-gray-500"
          }`}
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-lg">Match</p>
        <p className="text-xs text-white/50">
          {isTyping ? "Typing…" : online ? "Online now" : "Recently active"}
        </p>
      </div>

      <button
        onClick={onMatchAnimation}
        className="px-3 py-1 rounded-full bg-pink-500 text-xs font-semibold hover:bg-pink-600 transition"
      >
        Matched 💘
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Message bubble UI                             */
/* -------------------------------------------------------------------------- */

function MessageBubble({
  message,
  isMineMessage,
  onReply,
  showSeen,
}: {
  message: Message;
  isMineMessage: boolean;
  onReply: (m: Message) => void;
  showSeen: boolean;
}) {
  const hasImage = !!message.imageUrl;
  const hasAudio = !!message.audioUrl;

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    onReply(message);
  };

  return (
    <div
      className={`flex mb-2 ${
        isMineMessage ? "justify-end" : "justify-start"
      }`}
      onContextMenu={handleContextMenu}
    >
      <div className="max-w-[75%] space-y-1">
        <div
          className={`px-4 py-2 rounded-2xl text-sm ${
            isMineMessage
              ? "bg-pink-500 text-white rounded-br-none"
              : "bg-white/10 text-white rounded-bl-none"
          }`}
        >
          {hasImage && (
            <img
              src={message.imageUrl}
              className="mb-2 rounded-xl max-h-64 object-cover"
            />
          )}

          {hasAudio && (
            <audio controls className="w-full mb-2" src={message.audioUrl} />
          )}

          {message.text && <p>{message.text}</p>}
        </div>

        {isMineMessage && showSeen && (
          <p className="text-[10px] text-white/40 text-right">Seen</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             MessageInput (rich)                            */
/* -------------------------------------------------------------------------- */

function MessageInput({
  otherUserId,
  onTypingStart,
  onTypingStop,
  onSent,
  replyTo,
  clearReply,
}: {
  otherUserId: string;
  onTypingStart: () => void;
  onTypingStop: () => void;
  onSent: () => void;
  replyTo: Message | null;
  clearReply: () => void;
}) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTyping(value: string) {
    setText(value);

    if (!typingTimeoutRef.current) {
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
      typingTimeoutRef.current = null;
    }, 1500);
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    // In real app: upload to storage, get URL, send that
  }

  function toggleRecording() {
    // Stub: in real app, start/stop MediaRecorder
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      setAudioPreview("/fake-audio-url.mp3");
    } else {
      setAudioPreview(null);
    }
  }

  async function sendMessage() {
    if (!text.trim() && !imagePreview && !audioPreview) return;

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/messages/${otherUserId}`,
      {
        text: text.trim() || undefined,
        imageUrl: imagePreview || undefined,
        audioUrl: audioPreview || undefined,
        replyToId: replyTo?.id ?? undefined,
      },
      { withCredentials: true }
    );

    setText("");
    setImagePreview(null);
    setAudioPreview(null);
    clearReply();
    onSent();
    onTypingStop();
  }

  return (
    <div className="space-y-2">
      {/* Reply preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70"
          >
            <div className="truncate">
              Replying to:{" "}
              <span className="font-semibold">
                {replyTo.text || replyTo.imageUrl || "Message"}
              </span>
            </div>
            <button
              onClick={clearReply}
              className="text-white/50 hover:text-white text-[10px]"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment preview */}
      <AnimatePresence>
        {(imagePreview || audioPreview) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs"
          >
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            {audioPreview && (
              <span className="text-white/70">
                Voice message ready to send
              </span>
            )}
            <button
              onClick={() => {
                setImagePreview(null);
                setAudioPreview(null);
              }}
              className="ml-auto text-white/50 hover:text-white text-[10px]"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <div className="flex items-center gap-3">
        {/* Emoji (stub) */}
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xl">
          🙂
        </button>

        {/* Image upload */}
        <label className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg cursor-pointer">
          📎
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {/* Voice */}
        <button
          onClick={toggleRecording}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
            isRecording ? "bg-red-500" : "bg-white/10"
          }`}
        >
          🎤
        </button>

        {/* Text input */}
        <input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Message..."
          className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/40"
        />

        {/* Send */}
        <button
          onClick={sendMessage}
          className="px-4 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition text-white font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  ChatPage                                  */
/* -------------------------------------------------------------------------- */

export default function ChatPage() {
  const { id: otherUserId } = useParams();

  // ✅ FIX: destructure the hook so `socket` is the actual Socket, not the wrapper object
  const { socket } = useChatSocket();

  const { authUser } = useUserAuth();
  const meId: string | null = authUser?.id ?? null;

  const { data: messages } = useUserChat(otherUserId || null);

  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [matchPulse, setMatchPulse] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !otherUserId) return;

    const handleTypingStart = (fromId: string) => {
      if (fromId === otherUserId) setIsTyping(true);
    };

    const handleTypingStop = (fromId: string) => {
      if (fromId === otherUserId) setIsTyping(false);
    };

    const handleOnline = (userId: string) => {
      if (userId === otherUserId) setOnline(true);
    };

    const handleOffline = (userId: string) => {
      if (userId === otherUserId) setOnline(false);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("presence:online", handleOnline);
    socket.on("presence:offline", handleOffline);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("presence:online", handleOnline);
      socket.off("presence:offline", handleOffline);
    };
  }, [socket, otherUserId]);

  function handleTypingStart() {
    if (!socket || !otherUserId) return;
    socket.emit("typing:start", otherUserId);
  }

  function handleTypingStop() {
    if (!socket || !otherUserId) return;
    socket.emit("typing:stop", otherUserId);
  }

  function handleSent() {
    // hook for optimistic update or refetch if you want
  }

  function handleMatchAnimation() {
    setMatchPulse(true);
    setTimeout(() => setMatchPulse(false), 800);
  }

  const lastMessage =
    (messages?.[messages.length - 1] as Message | undefined) ?? undefined;

  const showSeen =
    !!lastMessage &&
    isMine(lastMessage, meId, otherUserId) &&
    lastMessage.read;

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Match pulse overlay */}
      <AnimatePresence>
        {matchPulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none bg-pink-500/40"
          />
        )}
      </AnimatePresence>

      <ChatHeader
        isTyping={isTyping}
        online={online}
        onMatchAnimation={handleMatchAnimation}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages?.map((msg) => {
          const message = msg as Message;
          const mine = isMine(message, meId, otherUserId);

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMineMessage={mine}
              onReply={setReplyTo}
              showSeen={showSeen && message.id === lastMessage?.id}
            />
          );
        })}

        {/* Typing bubble */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex justify-start mb-2"
            >
              <div className="px-4 py-2 rounded-2xl bg-white/10 text-white text-sm">
                Typing…
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {otherUserId && (
        <div className="p-4 border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <MessageInput
            otherUserId={otherUserId}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            onSent={handleSent}
            replyTo={replyTo}
            clearReply={() => setReplyTo(null)}
          />
        </div>
      )}
    </div>
  );
}
