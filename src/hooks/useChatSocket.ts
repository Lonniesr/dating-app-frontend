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
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    /* =========================
       CONNECTION EVENTS
    ========================= */

    socket.on("connect", () => {
      console.log("💬 Socket connected:", socket.id);
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
      console.log("📩 message:new received");

    });

    socket.on("conversation:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.on("notifications:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    /* =========================
       CLEANUP (ONLY ON UNMOUNT)
    ========================= */

    return () => {
      // ❌ DO NOT disconnect here
    };

  }, [authUser?.id]);

  /* =========================
     🔥 FIX: JOIN CONVERSATION
  ========================= */

  function joinConversation(otherUserId: string) {
    if (!socketRef.current) return;

    console.log("📡 Joining conversation with:", otherUserId);

    socketRef.current.emit("conversation:join", {
      otherUserId,
    });
  }

  return {
    socket: socketRef.current,
    ready,
    joinConversation, // 🔥 THIS WAS MISSING
  };
}