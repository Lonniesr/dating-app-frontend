import axios from "axios";

const BASE = "/api/admin/messages";

export interface MessageUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

export const adminMessagesService = {
  async list(): Promise<Message[]> {
    const res = await axios.get(BASE);
    return res.data.messages as Message[];
  },

  async getConversation(userA: string, userB: string): Promise<Message[]> {
    const res = await axios.get(`${BASE}/conversation`, {
      params: { userA, userB },
    });
    return res.data.messages as Message[];
  },

  async delete(id: string) {
    const res = await axios.delete(`${BASE}/${id}`);
    return res.data;
  },
};
