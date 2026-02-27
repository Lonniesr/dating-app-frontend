import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useAdminSocket(adminId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!adminId) return;

    const socket = io(import.meta.env.VITE_API_URL + "/admin", {
      auth: { adminId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [adminId]);

  return {
    socket: socketRef.current,

    sendAlert: (alert: { type: string; message: string }) => {
      socketRef.current?.emit("admin:alert", alert);
    },

    sendTimelineEvent: (event: { event: string; data?: any }) => {
      socketRef.current?.emit("admin:timeline", event);
    },

    sendSessionUpdate: (session: any) => {
      socketRef.current?.emit("admin:session", session);
    },
  };
}
