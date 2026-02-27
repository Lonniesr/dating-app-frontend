import axios from "axios";

const BASE = "/api/admin/admins";

export interface LinkedUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
  userId: string | null;
  user?: LinkedUser | null;
}

export const adminAdminsService = {
  async list(): Promise<Admin[]> {
    const res = await axios.get(BASE);
    return res.data.admins as Admin[];
  },

  async create(payload: { email: string; password: string; userId?: string }) {
    const res = await axios.post(BASE, payload);
    return res.data.admin as Admin;
  },

  async delete(id: string) {
    const res = await axios.delete(`${BASE}/${id}`);
    return res.data;
  },
};
