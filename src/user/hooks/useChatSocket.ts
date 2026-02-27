import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../context/UserAuthContext";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authUser?.id) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: authUser.id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("chat:join", authUser.id);
      setReady(true);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setReady(false);
    };
  }, [authUser?.id]);

  return {
    socket: socketRef.current,
    ready,
  };
}
