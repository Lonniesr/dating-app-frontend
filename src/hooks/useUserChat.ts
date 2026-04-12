import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { messagesService, Message } from "../user/services/messageService";
import { onMessage, getMessaging, isSupported } from "firebase/messaging";
import { initializeApp, getApps } from "firebase/app";

interface ChatResponse {
  messages: Message[];
  isBlocked: boolean;
}

/* 🔥 SAFE FIREBASE INIT (NO IMPORT DEPENDENCY) */
const firebaseConfig = {
  apiKey: "AIzaSyCuaQAKF0pXrKWWrdRObhV158dNbIzQn4U",
  authDomain: "lynq-3ba2d.firebaseapp.com",
  projectId: "lynq-3ba2d",
  storageBucket: "lynq-3ba2d.firebasestorage.app",
  messagingSenderId: "667931253340",
  appId: "1:667931253340:web:f2905cb18779b90e222499",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export function useUserChat(otherUserId: string | null) {

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const supported = await isSupported();
      if (!supported) return;

      const messaging = getMessaging(app);

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("🔥 Foreground message:", payload);

        if (Notification.permission === "granted") {
          new Notification(
            payload.notification?.title || "New message",
            {
              body: payload.notification?.body || "",
            }
          );
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return useQuery<ChatResponse>({
    queryKey: ["chat", otherUserId],
    queryFn: () => messagesService.getChatWith(otherUserId as string),
    enabled: !!otherUserId,
  });
}