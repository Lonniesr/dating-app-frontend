import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ConversationPreview = {
  conversationId: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    online?: boolean; // optional because backend may omit it
  };
  lastMessage?: {
    text?: string;        // optional because backend may omit it
    createdAt?: string;   // optional because backend may omit it
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
      return res.data as ConversationPreview[];
    },
  });
}
