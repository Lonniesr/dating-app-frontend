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
  audioUrl?: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  reactions?: string[];

  sender?: {
    photos?: { url: string }[];
  };
};

function resolvePhotoUrl(photo: any) {
  if (!photo) return null;

  const url =
    typeof photo === "string"
      ? photo
      : photo.url;

  if (!url) return null;

  if (url.startsWith("http")) return url;

  const { data } = supabase.storage.from("photos").getPublicUrl(url);
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
  // 🔥 REQUIRED FOR SMART REQUEST BUTTON
  const [requestMap, setRequestMap] = useState<Record<string, string>>({});

  // 🎤 MICROPHONE (ADDED ONLY)
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const hasSentRef = useRef(false);

  async function startRecording() {
    try {
      hasSentRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (hasSentRef.current) return;
        hasSentRef.current = true;

        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const filePath = `chat-audio/audio-${Date.now()}.webm`;

        const { error } = await supabase.storage
          .from("photos")
          .upload(filePath, blob);

        if (error) return;

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

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic error", err);
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === "inactive") return;

    mediaRecorderRef.current.stop();
    setRecording(false);
  }

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickReactions = ["❤️", "😂", "🔥", "👍"];

  // PROFILE STATE
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [requesting, setRequesting] = useState(false);

 async function openProfile(userId: string) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/profile/${userId}`,
      { withCredentials: true }
    );

    setProfileData(res.data);
    setSelectedUser(userId);

    // 🔥 load request state
    const reqRes = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/photo-access/mine`,
      { withCredentials: true }
    );

    const map: Record<string, string> = {};

    reqRes.data.forEach((r: any) => {
      map[r.photoId] = r.status;
    });

    setRequestMap(prev => {
  const merged = { ...prev };

  Object.entries(map).forEach(([photoId, status]) => {
    merged[photoId] = status;
  });

  return merged;
});
  } catch (err) {
    console.error("Failed to load profile", err);
  }
}

async function requestAccess(photoId: string, ownerId: string) {
  try {
    // optimistic (instant)
    setRequestMap(prev => ({
      ...prev,
      [photoId]: "pending"
    }));

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/photo-access/request`,
      {
        photoId,
        ownerId
      },
      { withCredentials: true }
    );

    // 🔥 FORCE CONFIRM (this is the missing piece)
    setRequestMap(prev => ({
      ...prev,
      [photoId]: "pending"
    }));

  } catch (err) {
    console.error("Request failed", err);

    setRequestMap(prev => {
      const copy = { ...prev };
      delete copy[photoId];
      return copy;
    });
  }
}
  
function closeProfile() {
  setSelectedUser(null);
  setProfileData(null);
}

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

        if (error) return;

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

  // ... EVERYTHING ABOVE YOUR RETURN STAYS EXACTLY THE SAME

  return (
    <div className="flex flex-col h-full bg-black text-white">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => {
          const mine = msg.senderId === meId;
          const avatarUrl = resolvePhotoUrl(msg.sender?.photos?.[0]);

          return (
            <div
              key={msg.id}
              className={`flex mb-3 items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {!mine && (
                <div
                  onClick={() => openProfile(msg.senderId)}
                  className="cursor-pointer"
                >
                  <Avatar src={avatarUrl} fallback="U" />
                </div>
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
                <div
                  onClick={() => openProfile(authUser?.id!)}
                  className="cursor-pointer"
                >
                  <Avatar
                    src={resolvePhotoUrl(authUser?.photos?.[0])}
                    fallback="ME"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ✅ PROFILE MODAL (ADDED BACK WITH REQUEST ACCESS) */}
      {selectedUser && profileData && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <button
            onClick={closeProfile}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div className="max-w-md mx-auto pt-16 pb-24 text-white px-4">

            <h2 className="text-2xl font-bold">
              {profileData.username || profileData.name}
              {profileData.age && `, ${profileData.age}`}
            </h2>

            {profileData.location && (
              <p className="text-white/60 mt-1">{profileData.location}</p>
            )}

            {profileData.bio && (
              <p className="mt-3 text-white/80">{profileData.bio}</p>
            )}

            {Array.isArray(profileData.prompts) && profileData.prompts.length > 0 && (
              <div className="mt-4 space-y-3">
                {profileData.prompts.map((p: any, i: number) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl">
                    <p className="text-xs text-white/50">{p.question}</p>
                    <p>{p.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(profileData.photos) &&
              profileData.photos.map((p: any, i: number) => {
                
                console.log("PHOTO:", p);
                console.log("PHOTO ID:", p?.id);
                console.log("STATUS:", requestMap[p?.id]);
                
                const isPrivate = typeof p === "object" && p.isPrivate;
                const url = typeof p === "string" ? p : p.url;

                return (
                  <div key={i} className="relative mt-4">
                    <img
                      src={url}
                      className={`w-full rounded-xl ${
                        isPrivate ? "blur-xl" : ""
                      }`}
                    />

                    {isPrivate && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-xl">

    {/* NOT REQUESTED */}
    {!requestMap[p.id] && (
      <button
        onClick={() => requestAccess(p.id, profileData.id)}
        className="bg-pink-500 px-4 py-2 rounded"
      >
        Request Access
      </button>
    )}

    {/* PENDING */}
    {requestMap[p.id] === "pending" && (
      <button
        disabled
        className="bg-gray-500 px-4 py-2 rounded opacity-70"
      >
        Requested
      </button>
    )}

    {/* APPROVED */}
    {requestMap[p.id] === "approved" && (
      <div className="text-green-400 text-sm">
        Access granted
      </div>
    )}

  </div>
)}
                  </div>
                );
              })}

          </div>
        </div>
      )}

      {/* INPUT BAR WITH FIXED MIC */}
      <div className="p-4 flex items-center gap-2">
        <button onClick={() => fileInputRef.current?.click()}>📎</button>

        <button
          onPointerDown={(e) => {
            e.stopPropagation();
            startRecording();
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            stopRecording();
          }}
          onPointerLeave={stopRecording}
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