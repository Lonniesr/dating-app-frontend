import api from "../../services/apiClient";

export const adminMeService = {
  async get() {
    const response = await api.get("/api/me", {
      withCredentials: true,
    });
    return response.data;
  },
};