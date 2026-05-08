import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserAuth } from "../user/context/UserAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket() {
  const { authUser } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [ready, setReady] = useState(false);

  const queryClient = useQueryClient();

  // 🔥 persist current conversation
  const currentConversationRef = useRef<string | null>(null);

  // 🔥 track active chat for notification suppression
  const activeChatRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    if (socketRef.current) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    /* =========================
       CONNECTION EVENTS
    ========================= */

    socket.on("connect", () => {
      console.log("💬 Socket connected:", socket.id);

      // 🔥 REQUIRED: register user on socket
      socket.emit("chat:join", authUser.id);

      setReady(true);

      // 🔁 rejoin conversation if needed
      if (currentConversationRef.current) {
        console.log("🔁 Rejoining conversation:", currentConversationRef.current);

        socket.emit("conversation:join", {
          otherUserId: currentConversationRef.current,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setReady(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });

    /* =========================
       DATA EVENTS
    ========================= */

    socket.on("message:new", () => {
      console.log("📩 message:new received");
    });

    socket.on("conversation:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    socket.on("notifications:update", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    /* =========================
       🔥 FIX: NOTIFICATION FILTER
    ========================= */

   socket.on("notification:message", ({ fromUserId }) => {
  const active = activeChatRef.current;

  if (active && String(fromUserId) === String(active)) {
    console.log("🔕 Suppressed notification (already in chat)", {
      fromUserId,
      active,
    });
    return;
  }

  console.log("🔔 New message notification", { fromUserId, active });

  // toast("💬 New message");
}); 

    return () => {
      // DO NOT disconnect
    };

  }, [authUser?.id]);

  /* =========================
     🔥 JOIN CONVERSATION
  ========================= */

  function joinConversation(otherUserId: string) {
    if (!socketRef.current) return;

    currentConversationRef.current = otherUserId;
    activeChatRef.current = otherUserId; // 🔥 track active chat

    console.log("📡 Joining conversation with:", otherUserId);

    socketRef.current.emit("conversation:join", {
      otherUserId,
    });
  }

  return {
    socket: socketRef.current,
    ready,
    joinConversation,
  };
}