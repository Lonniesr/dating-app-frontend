import axios from "axios";

const BASE = "/api/admin/matches";

export interface MatchUser {
  id: string;
  name: string | null;
  email: string;
}

export interface Match {
  id: string;
  createdAt: string;
  userA: MatchUser;
  userB: MatchUser;
}

export const adminMatchesService = {
  async list(): Promise<Match[]> {
    const res = await axios.get(BASE);
    return res.data.matches as Match[];
  },

  async delete(id: string) {
    const res = await axios.delete(`${BASE}/${id}`);
    return res.data;
  },
};
