import { useQuery } from "@tanstack/react-query";
import { messagesService } from "user/services/messageService";
import type { ConversationPreview } from "user/services/messageService";

export function useUserConversations() {
  return useQuery<ConversationPreview[]>({
    queryKey: ["conversations"],
    queryFn: () => messagesService.getConversations(),
  });
}
