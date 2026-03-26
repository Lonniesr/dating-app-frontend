import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getAdminSocket } from "../lib/socket";

import SlideInSidebar from "../core/SlideInSidebar";
import Header from "../core/Header";
import { ThemeProvider } from "../core/ThemeContext";
import { SidebarProvider } from "../core/SidebarContext";

// ✅ FIXED: correct import path
import { useAuthUser } from "../../hooks/useAuthUser";

export default function Layout() {
  // ✅ FIXED: correct destructuring
  const { data: user } = useAuthUser();

  useEffect(() => {
    // ❌ DO NOT connect unless admin
    if (user?.role !== "ADMIN") return;

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
  }, [user]);

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div
          className="flex min-h-screen 
                        bg-[#F8F6F1] text-gray-900
                        dark:bg-[#0B0B0C] dark:text-white
                        transition-colors duration-300"
        >
          <SlideInSidebar />

          <div className="flex flex-1 flex-col">
            <Header />

            <div className="flex-1 p-10">
              <div
                className="rounded-2xl p-10
                              bg-white border border-gray-200 shadow-md
                              dark:bg-[#141416] dark:border-[#222226] dark:shadow-[0_0_40px_rgba(212,175,55,0.05)]
                              transition-all duration-300"
              >
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}