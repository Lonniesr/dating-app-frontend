import axios from "axios";

const BASE = "/api/admin/verification";

export interface VerificationUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  verified: boolean;
}

export const adminVerificationService = {
  async list(): Promise<VerificationUser[]> {
    const res = await axios.get(BASE);
    return res.data.users as VerificationUser[];
  },

  async approve(userId: string): Promise<VerificationUser> {
    const res = await axios.post(`${BASE}/approve`, { userId });
    return res.data.user as VerificationUser;
  },

  async reject(userId: string): Promise<VerificationUser> {
    const res = await axios.post(`${BASE}/reject`, { userId });
    return res.data.user as VerificationUser;
  },
};
