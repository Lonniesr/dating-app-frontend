import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
let globalSocket: Socket | null = null;
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
if (globalSocket) {

  console.log("🛑 GLOBAL SOCKET EXISTS");

  socketRef.current = globalSocket;

  setSocket(globalSocket);

  setReady(globalSocket.connected);

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
    globalSocket = s;
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

  console.log("🧹 SOCKET CLEANUP");

  // 🚫 DO NOT destroy socket during normal rerenders
  if (window.location.pathname !== "/login") {
    return;
  }

  s.disconnect();

  socketRef.current = null;

  globalSocket = null;

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