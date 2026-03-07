import apiClient from "../../services/apiClient";

export interface UserInviteUser {
  id: string;
  name: string | null;
  email: string;
}

export interface UserInvite {
  id: string;
  code: string;
  used: boolean;
  usedAt: string | null;
  createdAt?: string;
  expiresAt?: string | null;
  invitedById?: string | null;
  usedById?: string | null;
  usedBy?: UserInviteUser | null;
  inviteLink?: string;
}

const BASE = "/api/invite"; // ✅ FIXED

export const userInvitesService = {
  async list(): Promise<UserInvite[]> {
    const res = await apiClient.get(BASE);
    return res.data.invites as UserInvite[];
  },

  async create(): Promise<UserInvite> {
    const res = await apiClient.post(BASE);

    return {
      id: res.data.id,
      code: res.data.code,
      inviteLink: res.data.inviteLink,
      used: res.data.used ?? false,
      usedAt: res.data.usedAt ?? null,
    };
  },

  async markUsed(inviteId: string, userId: string): Promise<UserInvite> {
    const res = await apiClient.post(`${BASE}/mark-used`, {
      inviteId,
      userId,
    });

    return res.data as UserInvite;
  },
};