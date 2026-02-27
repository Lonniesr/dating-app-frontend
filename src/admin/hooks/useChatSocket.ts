import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocket(userId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL + "/chat", {
      auth: { userId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return {
    socket: socketRef.current,

    typingStart: (toUserId: string) => {
      socketRef.current?.emit("typing:start", { toUserId });
    },

    typingStop: (toUserId: string) => {
      socketRef.current?.emit("typing:stop", { toUserId });
    },
  };
}
