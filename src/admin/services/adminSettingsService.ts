import BaseService from "./baseService";

export interface Setting {
  key: string;
  value: string;
}

const service = new BaseService("/api/admin/settings");

export const adminSettingsService = {
  async list(): Promise<Setting[]> {
    const res = await service.get();
    return res.data.settings as Setting[];
  },

  async get(key: string): Promise<Setting> {
    const res = await service.get(`/${key}`);
    return res.data.setting as Setting;
  },

  async save(key: string, value: string): Promise<Setting> {
    const res = await service.post("", { key, value });
    return res.data.setting as Setting;
  },
};