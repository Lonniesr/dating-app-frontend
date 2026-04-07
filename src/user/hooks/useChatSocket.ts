import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"], // ✅ FIX
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("💬 Socket connected:", socket.id);

      socket.emit("chat:join", authUser.id);
      setReady(true);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    socket.on("message:new", () => {
      console.log("📩 New message received");

      queryClient.invalidateQueries({ queryKey: ["chat"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setReady(false);
    };
  }, [authUser?.id, queryClient]);

  return {
    socket: socketRef.current,
    ready,
  };
}