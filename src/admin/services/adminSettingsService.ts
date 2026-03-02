import BaseService from "./baseService";

export interface Setting {
  key: string;
  value: string;
}

const service = new BaseService("/api/admin/settings");

export const adminSettingsService = {
  async list(): Promise<Setting[]> {
    const res = await service.get();

    const settingsObject = res.data?.settings;

    if (!settingsObject || typeof settingsObject !== "object") {
      return [];
    }

    return Object.entries(settingsObject)
      .filter(
        ([key]) =>
          key !== "id" &&
          key !== "createdAt" &&
          key !== "updatedAt"
      )
      .map(([key, value]) => ({
        key,
        value: String(value),
      }));
  },

  async get(key: string): Promise<Setting | null> {
    const res = await service.get();

    const settingsObject = res.data?.settings;

    if (!settingsObject || !(key in settingsObject)) {
      return null;
    }

    return {
      key,
      value: String(settingsObject[key]),
    };
  },

  async save(key: string, value: string): Promise<Setting> {
    const res = await service.post("", { key, value });

    return {
      key,
      value,
    };
  },
};