import { useEffect } from "react";
import type { Socket } from "socket.io-client";

export function useMessagesSocket(
  socket: Socket | null,
  onMessage: (msg: unknown) => void
) {
  useEffect(() => {
    if (!socket) return;

    const handler = (msg: unknown) => {
      onMessage(msg);
    };

    socket.on("message", handler);

    return () => {
      socket.off("message", handler);
    };
  }, [socket, onMessage]);
}
