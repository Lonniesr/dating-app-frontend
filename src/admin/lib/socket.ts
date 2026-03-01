import { io, Socket } from "socket.io-client";

let adminSocket: Socket | null = null;

export function getAdminSocket() {
  if (!adminSocket) {
    adminSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"], // 🔥 force websocket only
    });
  }

  return adminSocket;
}