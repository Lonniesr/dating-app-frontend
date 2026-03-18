// src/api/onboardingClient.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

/* =========================
   BASE CLIENTS
========================= */

const API = axios.create({
  baseURL: BASE_URL + "/api/onboarding",
});

const PROFILE_API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* =========================
   AUTH HEADER (for onboarding routes)
========================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   ONBOARDING CLIENT
========================= */

export const onboardingClient = {

  /* =========================
     AUTH / INVITE FLOW
  ========================= */

  validateInvite: async (inviteCode: string) => {
    const res = await API.post("/validate-invite", { inviteCode });
    return res.data;
  },

  register: async (data: {
    email: string;
    username: string;
    password: string;
    inviteCode: string;
  }) => {
    const res = await API.post("/register", data);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await API.post("/login", { email, password });
    return res.data;
  },

  /* =========================
     ONBOARDING STEPS
  ========================= */

  saveBasic: async (data: {
    name?: string;
    age?: number;
    bio?: string;
    location?: string;
  }) => {
    const res = await API.post("/basic", data);
    return res.data;
  },

  /**
   * 🔥 FIXED: ALWAYS SEND locationRadius
   */
  savePreferences: async (preferences: any) => {
    const res = await PROFILE_API.put("/api/profile", {
      preferences: {
        interestedIn: preferences.interestedIn,
        minAge: preferences.minAge,
        maxAge: preferences.maxAge,
        locationRadius:
          preferences.locationRadius !== undefined
            ? preferences.locationRadius
            : 50, // ✅ default fallback
      },
    });

    return res.data;
  },

  /**
   * OPTIONAL (can unify later, but safe to keep)
   */
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