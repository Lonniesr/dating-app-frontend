import { useQuery } from "@tanstack/react-query";
import { messagesService, Message } from "../services/messageService";

/* ✅ DEFINE CORRECT RESPONSE TYPE */
type ChatResponse = {
  messages: Message[];
  isBlocked: boolean;
};

export function useUserChat(otherUserId: string | null) {
  return useQuery<ChatResponse>({
    queryKey: ["chat", otherUserId],

    queryFn: () => {
      if (!otherUserId) {
        throw new Error("No user ID provided");
      }

      return messagesService.getChatWith(otherUserId);
    },

    enabled: !!otherUserId,
  });
}