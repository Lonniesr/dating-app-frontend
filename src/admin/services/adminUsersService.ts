import BaseService from "./BaseService";

class AdminUsersService extends BaseService {
  updateUser(id: string, payload: { banned: boolean }) {
    return this.put(`/${id}`, payload);
  }
}

export const adminUsersService = new AdminUsersService("api/admin/users");
