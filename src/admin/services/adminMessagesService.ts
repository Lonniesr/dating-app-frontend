import BaseService from "./baseService";

const base = new BaseService("/api/admin/messages");

export interface MessageUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

export const adminMessagesService = {
  async list(): Promise<Message[]> {
    const res = await base.get();
    return res.data.messages as Message[];
  },

  async getConversation(userA: string, userB: string): Promise<Message[]> {
    const res = await base.get("/conversation", {
      params: { userA, userB },
    });
    return res.data.messages as Message[];
  },

  async sendToUser(
    userId: string,
    message: string
  ) {
    const res = await base.post("/user", {
      userId,
      message,
    });

    return res.data;
  },
  async sendToAll(
    message: string
  ) {
    const res = await base.post("/all", {
      message,
    });

    return res.data;
  },

  async sendToVerified(
    message: string
  ) {
    const res = await base.post("/verified", {
      message,
    });

    return res.data;
  },

  async sendToUnverified(
    message: string
  ) {
    const res = await base.post("/unverified", {
      message,
    });

    return res.data;
  },
  
  async delete(id: string) {
    const res = await base.deleteReq(`/${id}`);
    return res.data;
  },
};