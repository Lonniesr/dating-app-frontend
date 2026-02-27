import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getAdminSocket } from "../lib/socket";

export default function Layout() {
  useEffect(() => {
    const socket = getAdminSocket();

    socket.on("connect", () => {
      console.log("ADMIN SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("ADMIN SOCKET ERROR:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}
