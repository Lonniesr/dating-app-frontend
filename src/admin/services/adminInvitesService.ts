import api from "../../services/apiClient";

export interface Invite {
  id: number;
  code: string;
  email?: string | null;
  premium: boolean;
  createdAt: string;
  expiresAt?: string | null;
  used: boolean;
  inviteUrl: string;
}

export const adminInvitesService = {
  async list() {
    const res = await api.get("/api/admin/invites");
    return res.data.invites as Invite[];
  },

  async create(payload: {
    email?: string;
    expiresAt?: string;
    premium?: boolean;
  }) {
    const res = await api.post("/api/admin/invites", payload);
    return res.data as Invite;
  },
};