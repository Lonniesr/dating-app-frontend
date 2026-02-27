import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../services/messagesService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type MessagesSocket = Socket & {
  // you can extend later if needed
};

export function useMessagesSocket(userId: string | null, otherUserId?: string | null) {
  const socketRef = useRef<MessagesSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket: MessagesSocket = io(`${API_URL}/messages`, {
      auth: { userId },
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    if (otherUserId) {
      socket.emit("conversation:join", { otherUserId });
    }

    return () => {
      socket.disconnect();
    };
  }, [userId, otherUserId]);

  return {
    socket: socketRef.current,

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

    onMessageReceived: (handler: (msg: Message) => void) => {
      socketRef.current?.on("message:received", handler);
    },

    onMessageSent: (handler: (msg: Message) => void) => {
      socketRef.current?.on("message:sent", handler);
    },

    onConversationMessage: (handler: (msg: Message) => void) => {
      socketRef.current?.on("conversation:message", handler);
    },
  };
}
