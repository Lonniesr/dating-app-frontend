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
  age: number | null;
  location: string | null;
  photos: string[];
  createdAt: string;
  lastActiveAt: string | null;
  matches: UserMatch[];
}

export const adminUserDetailService = {
  async get(id: string): Promise<AdminUserDetail> {
    const res = await api.get(`${BASE}/${id}`); // ✅ FIXED
    return res.data as AdminUserDetail;
  },
};