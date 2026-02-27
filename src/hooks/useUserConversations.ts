import { useQuery } from "@tanstack/react-query";
import { messagesService } from "../services/messageService";
import type { ConversationPreview } from "../services/messageService";

export function useUserConversations() {
  return useQuery<ConversationPreview[]>({
    queryKey: ["conversations"],
    queryFn: () => messagesService.getConversations(),
  });
}
