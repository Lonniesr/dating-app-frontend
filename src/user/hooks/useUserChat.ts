import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { messagesService, Message } from "../services/messageService";
import { onMessage } from "firebase/messaging";
import { getMessagingInstance } from "../../firebase";

interface ChatResponse {
  messages: Message[];
  isBlocked: boolean;
}

export function useUserChat(otherUserId: string | null) {

  /* =========================
     🔥 FOREGROUND PUSH LISTENER
  ========================= */
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      const messaging = await getMessagingInstance();

      if (!messaging) return;

     unsubscribe = onMessage(messaging, (payload) => {
  console.log("🔥 Foreground message:", payload);
}); 
    };

    setupListener();

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