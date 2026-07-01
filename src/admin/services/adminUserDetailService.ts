import api from "../../services/apiClient";

const BASE = "/api/admin/users";

export interface UserMatch {
  id: string;
  createdAt: string;
  otherUserId: string;
  otherUserName: string | null;
}

export interface AdminUserDetail {
  id: string;

  name: string | null;
  username?: string | null;
  email?: string | null;

  role?: string;
  verified?: boolean;
  banned?: boolean;
  shadowBanned?: boolean;

  age: number | null;
  location: string | null;

  photos: string[];

  createdAt: string;
  lastActiveAt: string | null;

  messageCount?: number;
  swipeCount?: number;
  inviteCount?: number;
  reportCount?: number;

  matches: UserMatch[];
  conversations: UserConversation[];

  swipes: UserSwipe[];
  invites?: any[];
}
export interface UserConversation {
  id: string;
  otherUserName: string;
  lastMessage: string;
  createdAt: string;
}
export interface UserSwipe {
  id: string;
  targetName: string;
  liked: boolean;
  superLike: boolean;
  createdAt: string;
}
export const adminUserDetailService = {
  async get(id: string): Promise<AdminUserDetail> {
    const res = await api.get(`${BASE}/${id}`); // ✅ FIXED
    return res.data as AdminUserDetail;
  },
};