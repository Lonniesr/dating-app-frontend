import axios from "axios";

const BASE = "/api/admin/settings";

export interface Setting {
  key: string;
  value: string;
}

export const adminSettingsService = {
  async list(): Promise<Setting[]> {
    const res = await axios.get(BASE);
    return res.data.settings as Setting[];
  },

  async get(key: string): Promise<Setting> {
    const res = await axios.get(`${BASE}/${key}`);
    return res.data.setting as Setting;
  },

  async save(key: string, value: string): Promise<Setting> {
    const res = await axios.post(BASE, { key, value });
    return res.data.setting as Setting;
  },
};
