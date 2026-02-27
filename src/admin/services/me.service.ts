import { apiClient } from "./apiClient";

export const adminMeService = {
  async get() {
    const res = await apiClient.get("/admin/me");
    return res.data;
  },
};
