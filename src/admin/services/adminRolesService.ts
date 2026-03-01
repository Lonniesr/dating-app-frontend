import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 🔥 pulls from VITE_API_URL
  withCredentials: true, // important if using cookies
});

const BASE = "/api/admin/roles";

export interface Role {
  id: string;
  name: string;
}

export interface RoleUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  role: string;
}

export const adminRolesService = {
  async listRoles(): Promise<Role[]> {
    const res = await api.get(BASE);
    return res.data.roles as Role[];
  },

  async listUsersByRole(role: string): Promise<RoleUser[]> {
    const res = await api.get(`${BASE}/users`, { params: { role } });
    return res.data.users as RoleUser[];
  },

  async assignRole(userId: string, role: string): Promise<RoleUser> {
    const res = await api.post(`${BASE}/assign`, { userId, role });
    return res.data.user as RoleUser;
  },
};