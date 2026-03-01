import api from "../../services/apiClient";

export const adminDashboardService = {
  async get() {
    const res = await api.get("/api/admin/dashboard");
    return res.data;
  },
};