import BaseService from "./baseService";

export interface VerificationUser {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
  name?: string;
  verification_selfie?: string;
  verification_status?: string;
}

const service = new BaseService("/api/admin/verification");

export const adminVerificationService = {
  async list(): Promise<VerificationUser[]> {
    const res = await service.get();
    return res.data.users ?? []; // ✅ matches backend
  },

  async approve(userId: string) {
    const res = await service.post(`/${userId}/approve`);
    return res.data;
  },

  async reject(userId: string) {
    const res = await service.post(`/${userId}/reject`);
    return res.data;
  },
};