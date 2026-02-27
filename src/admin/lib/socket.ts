import { io } from "socket.io-client";

let adminSocket;

export function getAdminSocket() {
  if (!adminSocket) {
    adminSocket = io("http://localhost:3001/admin", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return adminSocket;
}
