import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    // 🚨 prevent multiple socket instances
    if (socketRef.current) return;

    const s = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],

      // 🔥 FIX: stable connection (no disconnect loop)
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,

      // 🔥 REQUIRED for auth
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("💬 Socket connected:", s.id);

      // join personal room
      s.emit("chat:join", authUser.id);

      // 🔥 ALWAYS rejoin conversation after reconnect
      if (currentRoomRef.current) {
        console.log("🔁 Rejoining room:", currentRoomRef.current);

        s.emit("conversation:join", {
          otherUserId: currentRoomRef.current,
        });
      }

      setReady(true);
    });

    s.on("disconnect", (reason) => {
      console.log("❌ SOCKET DISCONNECTED:", reason);
    });

    s.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    /* =========================
       TYPING LISTENERS
    ========================= */

    s.on("typing:start", (data: any) => {
      if (!data?.fromUserId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [data.fromUserId]: true,
      }));
    });

    s.on("typing:stop", (data: any) => {
      if (!data?.fromUserId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [data.fromUserId]: false,
      }));
    });

  }, [authUser?.id]); // ✅ FIX: removed unstable deps

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setReady(false);
      }
    };
  }, []);

  /* =========================
     JOIN CONVERSATION
  ========================= */

  const joinConversation = (otherUserId: string) => {
    if (!socketRef.current) return;

    currentRoomRef.current = otherUserId;

    console.log("🚪 JOIN:", otherUserId);

    socketRef.current.emit("conversation:join", {
      otherUserId,
    });
  };

  return {
    socket,
    ready,
    typingUsers,
    joinConversation,
  };
}