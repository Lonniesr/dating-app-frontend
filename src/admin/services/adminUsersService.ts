import BaseService from "./baseService";

class AdminUsersService extends BaseService {

  async list(params?: { page?: number; limit?: number; search?: string }) {
    const res = await this.get("/", { params });

    return res.data; // ✅ THIS FIXES EVERYTHING
  }

  updateUser(id: string, payload: { banned: boolean }) {
    return this.put(`/${id}`, payload);
  }
}

export const adminUsersService = new AdminUsersService("api/admin/users");