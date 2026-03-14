import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ConversationPreview = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    online?: boolean;
  };
  lastMessage?: {
    text?: string;
    createdAt?: string;
  } | null;
  unreadCount: number;
};

export function useConversations() {
  return useQuery<ConversationPreview[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/conversations`,
        { withCredentials: true }
      );

      return res.data.map((c: any) => ({
        id: c.conversationId,
        user: c.user,
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCount ?? 0
      }));
    },
  });
}