import apiClient from "../../services/apiClient";

export interface InviteUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Invite {
  id: string;
  code: string;
  used: boolean;
  usedAt: string | null;
  createdAt: string;
  expiresAt?: string | null;
  premium?: boolean;
  invitedById?: number | null;
  usedById: string | null;
  usedBy?: InviteUser | null;
  url?: string; // <-- IMPORTANT
}

const BASE = "/api/admin/invites";

export const adminInvitesService = {
  async list(): Promise<Invite[]> {
    const res = await apiClient.get(BASE);
    return res.data.invites as Invite[];
  },

  async create(): Promise<Invite> {
    const res = await apiClient.post(BASE);
    return res.data as Invite; // <-- FIXED
  },

  async markUsed(inviteId: string, userId: string): Promise<Invite> {
    const res = await apiClient.post(`${BASE}/mark-used`, {
      inviteId,
      userId,
    });
    return res.data as Invite;
  },
};
