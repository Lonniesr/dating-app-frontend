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
    if (socketRef.current) return;

    const s = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      console.log("💬 Socket connected:", s.id);

      s.emit("chat:join", authUser.id);

      // 🔥 FORCE REJOIN AFTER CONNECT
      if (currentRoomRef.current) {
        console.log("🔁 Rejoining room:", currentRoomRef.current);

        s.emit("conversation:join", {
          otherUserId: currentRoomRef.current,
        });

        // 🔥 second emit to beat race conditions
        setTimeout(() => {
          s.emit("conversation:join", {
            otherUserId: currentRoomRef.current!,
          });
        }, 300);
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
      console.log("👀 RECEIVED typing:start:", data);

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

  }, [authUser?.id]);

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
     JOIN CONVERSATION (FIXED)
  ========================= */

  const joinConversation = (otherUserId: string) => {
    if (!socketRef.current) return;

    currentRoomRef.current = otherUserId;

    console.log("🚪 JOIN (FORCED):", otherUserId);

    // 🔥 send immediately
    socketRef.current.emit("conversation:join", {
      otherUserId,
    });

    // 🔥 retry (handles race condition)
    setTimeout(() => {
      socketRef.current?.emit("conversation:join", {
        otherUserId,
      });
    }, 300);
  };

  return {
    socket,
    ready,
    typingUsers,
    joinConversation,
  };
}