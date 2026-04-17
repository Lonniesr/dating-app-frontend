import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);

  // ✅ NEW: typing state
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    if (!socketRef.current) {
      const s = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        transports: ["polling", "websocket"],
      });

      socketRef.current = s;
      setSocket(s);

      s.on("connect", () => {
        console.log("💬 Socket connected:", s.id);

        s.emit("chat:join", authUser.id);
        setReady(true);
      });

      s.on("connect_error", (err) => {
        console.error("❌ SOCKET ERROR:", err.message);
      });

      /* =========================
         ✅ FINAL FIXED TYPING LISTENERS
      ========================= */

      s.on("typing:start", (...args: any[]) => {
        const data = args[0];

        if (!data || typeof data !== "object" || !data.fromUserId) {
          return; // 🔥 completely ignore
        }

        setTypingUsers((prev) => ({
          ...prev,
          [data.fromUserId]: true,
        }));
      });

      s.on("typing:stop", (...args: any[]) => {
        const data = args[0];

        if (!data || typeof data !== "object" || !data.fromUserId) {
          return; // 🔥 completely ignore
        }

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

  return {
    socket,
    ready,
    typingUsers, // ✅ expose this
  };
}