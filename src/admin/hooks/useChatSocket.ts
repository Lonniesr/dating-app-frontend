import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { supabase } from "../../lib/supabaseClient";

export function useChatSocket(userId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    let socket: Socket;

    const connectSocket = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        console.error("❌ No auth token for socket");
        return;
      }

      socket = io(import.meta.env.VITE_API_URL + "/chat", {
        auth: { token }, // ✅ FIXED
        transports: ["websocket"],
      });

      socket.on("connect_error", (err) => {
        console.error("🔥 SOCKET ERROR:", err.message);
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
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