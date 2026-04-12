import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null); // 🔥 ADD THIS
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser?.id) return;

    // 🔥 prevent duplicate sockets
    if (socketRef.current) return;

    const s = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
    });

    socketRef.current = s;
    setSocket(s); // 🔥 THIS IS THE FIX

    s.on("connect", () => {
      console.log("💬 Socket connected:", s.id);

      s.emit("chat:join", authUser.id);
      setReady(true);
    });

    s.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    s.on("message:new", () => {
      console.log("📩 New message received");

      queryClient.invalidateQueries({ queryKey: ["chat"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    return () => {
      s.off("connect");
      s.off("connect_error");
      s.off("message:new");

      s.disconnect();
      socketRef.current = null;
      setSocket(null); // 🔥 ADD THIS
      setReady(false);
    };
  }, [authUser?.id, queryClient]);

  return {
    socket, // 🔥 RETURN STATE INSTEAD
    ready,
  };
}