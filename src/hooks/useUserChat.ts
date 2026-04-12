import { useQuery } from "@tanstack/react-query";
import { messagesService, Message } from "../user/services/messageService";

/* 🔥 NEW RESPONSE TYPE */
interface ChatResponse {
  messages: Message[];
  isBlocked: boolean;
}

export function useUserChat(otherUserId: string | null) {
  return useQuery<ChatResponse>({
    queryKey: ["chat", otherUserId],
    queryFn: () => messagesService.getChatWith(otherUserId as string),
    enabled: !!otherUserId,
  });
}