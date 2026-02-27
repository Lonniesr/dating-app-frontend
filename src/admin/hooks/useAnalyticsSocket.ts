import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useAnalyticsSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL + "/analytics", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,

    sendPageView: (data: any) => {
      socketRef.current?.emit("page_view", data);
    },

    sendMetric: (metric: any) => {
      socketRef.current?.emit("metric", metric);
    },
  };
}
