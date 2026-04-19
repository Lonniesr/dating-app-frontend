import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const currentRoomRef = useRef<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    if (!socketRef.current) {
      const s = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"],
        reconnection: true,

        // 🔥 FIX: send JWT to backend (required for mobile)
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("💬 Socket connected:", s.id);

        s.emit("chat:join", authUser.id);

        // 🔥 REJOIN ROOM AFTER RECONNECT
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

      // ✅ typing listeners
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
    }

    return () => {};
  }, [authUser?.id, queryClient]);

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

  // 🔥 JOIN ROOM FUNCTION
  const joinConversation = (otherUserId: string) => {
    if (!socketRef.current) return;

    currentRoomRef.current = otherUserId;

    console.log("🚪 JOIN (FORCED):", otherUserId);

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