const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* =======================
   Types
======================= */

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  reaction?: string;
  read: boolean;
  createdAt: string;
};

export type ConversationPreview = {
  userId: string;
  lastMessage: Message;
  unread: number;
  user: {
    id: string;
    name: string | null;
    photos: string[];
    location: string | null;
  } | null;
};

/* =======================
   Helpers
======================= */

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}

/* =======================
   Service
======================= */

export const messagesService = {
  async getConversations(): Promise<ConversationPreview[]> {
    const res = await fetch(`${API_URL}/api/messages`, {
      credentials: "include",
    });
    return handle(res);
  },

  async getChatWith(userId: string): Promise<Message[]> {
    const res = await fetch(`${API_URL}/api/messages/${userId}`, {
      credentials: "include",
    });
    return handle(res);
  },

  async sendMessage(
    receiverId: string,
    payload: {
      text?: string;
      imageUrl?: string;
      audioUrl?: string;
      reaction?: string;
    }
  ): Promise<Message> {
    const res = await fetch(`${API_URL}/api/messages/${receiverId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handle(res);
  },
};
