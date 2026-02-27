import axios from "axios";

const BASE = "/api/admin/stats";

export interface AdminStatsResponse {
  users: any;
  matches: any;
  messages: any;
  charts: any;
  distribution: any;
}

export const adminStatsService = {
  async get(): Promise<AdminStatsResponse> {
    const res = await axios.get(BASE);
    return res.data.stats as AdminStatsResponse;
  },
};
