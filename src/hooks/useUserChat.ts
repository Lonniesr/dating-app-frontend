import { useQuery } from "@tanstack/react-query";
import { messagesService, Message } from "../user/services/messageService";

export function useUserChat(otherUserId: string | null) {
  return useQuery<Message[]>({
    queryKey: ["chat", otherUserId],
    queryFn: () => messagesService.getChatWith(otherUserId as string),
    enabled: !!otherUserId,
  });
}