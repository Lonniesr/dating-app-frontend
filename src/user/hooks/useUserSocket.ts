import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useUserSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const currentRoomRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("🔥 useUserSocket userId:", userId);

    if (!userId) return;

    // 🛑 prevent duplicate sockets
    if (socketRef.current) {
      console.log("🛑 SOCKET ALREADY EXISTS");

      setSocket(socketRef.current);

      setReady(!!socketRef.current.connected);

      return;
    }

    console.log(
      "🌐 CONNECTING TO:",
      import.meta.env.VITE_API_URL
    );

    const s = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = s;

    setSocket(s);

    s.once("connect", () => {
      console.log("✅ SOCKET CONNECTED:", s.id);

      s.emit("chat:join", userId);

      setReady(true);
    });

    s.on("disconnect", () => {
      console.log("❌ SOCKET DISCONNECTED");

      setReady(false);
    });

    s.on(
      "typing:start",
      ({ userId }: { userId: string }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [userId]: true,
        }));
      }
    );

    s.on(
      "typing:stop",
      ({ userId }: { userId: string }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [userId]: false,
        }));
      }
    );

    s.on(
      "presence:update",
      ({
        userId,
        online,
      }: {
        userId: string;
        online: boolean;
      }) => {
        console.log(
          "👤 PRESENCE UPDATE:",
          userId,
          online
        );

        setOnlineUsers((prev) => ({
          ...prev,
          [userId]: online,
        }));
      }
    );

    console.log(
      "🔥 ONLINE USERS STATE:",
      onlineUsers
    );

    return () => {
      console.log("🧹 CLEANING SOCKET");

      s.disconnect();

      socketRef.current = null;

      setSocket(null);

      setReady(false);
    };

  }, [userId]);

  const joinConversation = (
    conversationId: string
  ) => {
    if (!socketRef.current) return;

    currentRoomRef.current = conversationId;

    console.log("📥 JOIN ROOM:", conversationId);

    socketRef.current.emit(
      "conversation:join",
      {
        otherUserId: conversationId,
      }
    );
  };

  const leaveConversation = (
    conversationId: string
  ) => {
    if (!socketRef.current) return;

    console.log("📤 LEAVE ROOM:", conversationId);

    socketRef.current.emit(
      "conversation:leave",
      {
        otherUserId: conversationId,
      }
    );

    if (currentRoomRef.current === conversationId) {
      currentRoomRef.current = null;
    }
  };

  const startTyping = (
    conversationId: string
  ) => {
    if (!socketRef.current) return;

    socketRef.current.emit("typing:start", {
      to: conversationId,
    });
  };

  const stopTyping = (
    conversationId: string
  ) => {
    if (!socketRef.current) return;

    socketRef.current.emit("typing:stop", {
      to: conversationId,
    });
  };

  return {
    socket,
    ready,
    typingUsers,
    currentRoomRef,
    onlineUsers,

    joinConversation,
    leaveConversation,

    startTyping,
    stopTyping,
  };
}