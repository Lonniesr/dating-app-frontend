import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    // ✅ create ONLY once
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

      // ❌ REMOVED message:new invalidation (THIS WAS CAUSING DUPLICATES)
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
  };
}