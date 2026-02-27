// src/api/onboardingClient.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/onboarding",
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const onboardingClient = {
  saveBasic: async (data: {
    name?: string;
    age?: number;
    bio?: string;
    location?: string;
  }) => {
    const res = await API.post("/basic", data);
    return res.data;
  },

  savePreferences: async (preferences: any) => {
    const res = await API.post("/preferences", preferences);
    return res.data;
  },

  savePersonality: async (personality: any) => {
    const res = await API.post("/personality", personality);
    return res.data;
  },

  savePhotos: async (photos: string[]) => {
    const res = await API.post("/photos", { photos });
    return res.data;
  },

  complete: async () => {
    const res = await API.post("/complete");
    return res.data;
  },
};
