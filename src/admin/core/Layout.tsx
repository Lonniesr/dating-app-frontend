import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getAdminSocket } from "../lib/socket";

import SlideInSidebar from "../core/SlideInSidebar";
import Header from "../core/Header";
import { ThemeProvider } from "../core/ThemeContext";
import { SidebarProvider } from "../core/SidebarContext";

export default function Layout() {
  useEffect(() => {
    const socket = getAdminSocket();

    socket.on("connect", () => {
      console.log("ADMIN SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("ADMIN SOCKET ERROR:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          
          {/* Sidebar */}
          <SlideInSidebar />

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "var(--lynq-dark-1)",
            }}
          >
            {/* Header */}
            <Header />

            {/* Page Content */}
            <div style={{ flex: 1, padding: "2rem" }}>
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}