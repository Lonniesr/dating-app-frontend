import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useMessagesSocket(userId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL + "/messages", {
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

    joinConversation: (otherUserId: string) => {
      socketRef.current?.emit("conversation:join", { otherUserId });
    },

    sendMessage: (payload: {
      receiverId: string;
      text?: string;
      imageUrl?: string;
      audioUrl?: string;
      reaction?: string;
    }) => {
      socketRef.current?.emit("message:send", payload);
    },

    markRead: (otherUserId: string) => {
      socketRef.current?.emit("message:read", { otherUserId });
    },
  };
}
