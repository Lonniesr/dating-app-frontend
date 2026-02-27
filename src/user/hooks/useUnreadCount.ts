import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";

export function useUnreadCount() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!authUser?.id) return;

    // Create socket
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: authUser.id },
    });

    socketRef.current = socket;

    // When connected, join unread room
    socket.on("connect", () => {
      socket.emit("unread:join", authUser.id);
    });

    // Listen for unread updates
    const handleUnread = (count: number) => {
      setUnread(count);
    };

    socket.on("unread:update", handleUnread);

    // Cleanup
    return () => {
      socket.off("unread:update", handleUnread);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser?.id]);

  return unread;
}
