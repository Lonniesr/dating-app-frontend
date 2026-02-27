import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type ChatSocket = Socket & {};

export function useChatSocket(userId: string | null) {
  const socketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket: ChatSocket = io(`${API_URL}/chat`, {
      auth: { userId },
      transports: ["websocket"],
      withCredentials: true,
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

    onTypingStart: (handler: (payload: { fromUserId: string }) => void) => {
      socketRef.current?.on("typing:start", handler);
    },

    onTypingStop: (handler: (payload: { fromUserId: string }) => void) => {
      socketRef.current?.on("typing:stop", handler);
    },
  };
}
