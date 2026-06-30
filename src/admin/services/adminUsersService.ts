import BaseService from "./baseService";
import axios from "axios";

class AdminUsersService extends BaseService {
  async list(params?: { page?: number; limit?: number; search?: string }) {
    const res = await this.get("/", { params });
    return res.data;
  }

  // ✅ BAN USER (with reason + optional duration)
  banUser(
    id: string,
    options?: {
      reason?: string;
      durationHours?: number;
    }
  ) {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/bans/${id}`,
      {
        reason: options?.reason,
        durationHours: options?.durationHours,
      },
      { withCredentials: true }
    );
  }

  // ✅ UNBAN USER
  unbanUser(id: string) {
    return axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/bans/${id}`,
      { withCredentials: true }
    );
  }

  // ✅ DELETE USER
deleteUser(id: string) {
  return axios.delete(
    `${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
    {
      withCredentials: true,
    }
  );
}
}

export const adminUsersService = new AdminUsersService("api/admin/users");