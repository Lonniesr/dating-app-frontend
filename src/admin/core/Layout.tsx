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
        <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-lynq-dark dark:text-white transition-colors duration-300">
          
          {/* Sidebar */}
          <SlideInSidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            
            {/* Header */}
            <Header />

            {/* Page Content */}
            <div className="flex-1 p-8">
              <Outlet />
            </div>

          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}