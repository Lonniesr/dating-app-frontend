import BaseService from "./BaseService";

class AdminBansService extends BaseService {
  updateBanStatus(payload: { id: string; banned: boolean }) {
    return this.post(`/${payload.id}`, { banned: payload.banned });
  }
}

export const adminBansService = new AdminBansService("api/admin/bans");
