import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../user/context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    // ✅ Prevent duplicate connections
    if (socketRef.current) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io",
      transports: ["polling", "websocket"], // ✅ Render-safe
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    /* =========================
       CONNECTION EVENTS
    ========================= */

    socket.on("connect", () => {
      console.log("💬 Socket connected:", socket.id);

      socket.emit("chat:join", authUser.id);

      setReady(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setReady(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    /* =========================
       DATA EVENTS
    ========================= */

    socket.on("message:new", () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.on("conversation:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.on("notifications:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    /* =========================
       CLEANUP
    ========================= */

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setReady(false);
    };
  }, [authUser?.id, queryClient]);

  return {
    socket: socketRef.current,
    ready,
  };
}