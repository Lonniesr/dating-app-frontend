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

    const socket = io(`${import.meta.env.VITE_API_URL}/chat`, {
      withCredentials: true,
      query: { userId: authUser.id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("💬 Socket connected");
      socket.emit("chat:join", authUser.id);
      setReady(true);
    });

    /* =========================
       NEW MESSAGE RECEIVED
    ========================= */

    socket.on("message:new", () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    /* =========================
       CONVERSATION UPDATE
    ========================= */

    socket.on("conversation:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    /* =========================
       NOTIFICATION UPDATE
    ========================= */

    socket.on("notifications:update", () => {
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