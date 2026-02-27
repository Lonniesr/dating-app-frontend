import { useQuery } from "@tanstack/react-query";
import { messagesService, Message } from "../services/messageService";

export function useUserChat(otherUserId: string | null) {
  return useQuery<Message[]>({
    queryKey: ["chat", otherUserId],

    // ✅ Safe guard — will never run if null
    queryFn: () => {
      if (!otherUserId) {
        throw new Error("No user ID provided");
      }

      return messagesService.getChatWith(otherUserId);
    },

    // ✅ Prevents ghost fetch like /null
    enabled: !!otherUserId,
  });
}