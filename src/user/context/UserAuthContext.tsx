import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getPushToken } from "../../firebase"; // 🔥 NEW
import axios from "axios"; // 🔥 NEW

/* =========================
   USER TYPES
========================= */

type Preferences = {
  interestedIn?: string;
  racePreference?: string | null;
  minAge?: number;
  maxAge?: number;
  locationRadius?: number | null;

  onlyVerified?: boolean;
  boostVerified?: boolean;
  prioritizeLikedYou?: boolean;

  messageNotifications?: boolean;
  matchNotifications?: boolean;
  marketingNotifications?: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;

  name?: string;
  username?: string;

  bio?: string;
  gender?: string;
  race?: string;

  birthdate?: string;
  age?: number;

  birthplace?: string;
  location?: string;

  latitude?: number;
  longitude?: number;

  photos?: string[];

  prompts?: Record<string, unknown>;

  preferences?: Preferences;

  verified?: boolean;
  verification_status?: "none" | "pending" | "approved" | "rejected";

  onboardingComplete?: boolean;

  lastActiveAt?: string;

  photoUrl?: string; // 🔥 FIX ADDED HERE
};

/* =========================
   CONTEXT TYPES
========================= */

type AuthContextType = {
  authUser: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  getOnboardingStep: (user: AuthUser) => string | null;
};

const UserAuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/* =========================
   PROVIDER
========================= */

export function UserAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     🔥 PUSH SETUP (NEW)
  ========================= */

  async function setupPush() {
    try {
      const token = await getPushToken();

      if (!token) return;

      console.log("🔥 Sending push token to backend:", token);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/push-token`,
        { token },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Push setup failed:", err);
    }
  }

  /* =========================
     DETERMINE ONBOARDING STEP
  ========================= */

  function getOnboardingStep(user: AuthUser): string | null {
    if (user.role === "admin") return null;

    const hasBasic =
      Boolean(user.name?.trim()) &&
      Boolean(user.birthdate);

    const hasIdentity =
      Boolean(user.gender?.trim()) &&
      Boolean(user.race?.trim());

    const hasPhotos =
      Array.isArray(user.photos) &&
      user.photos.length > 0;

    const hasPreferences =
      !!user.preferences &&
      Boolean(user.preferences.interestedIn) &&
      Boolean(user.preferences.minAge) &&
      Boolean(user.preferences.maxAge);

    const hasPrompts =
      !!user.prompts &&
      Object.keys(user.prompts).length > 0;

    if (!hasBasic) return "/invite/onboarding";
    if (!hasIdentity) return "/invite/onboarding";
    if (!hasPhotos) return "/invite/onboarding";
    if (!hasPreferences) return "/invite/onboarding";
    if (!hasPrompts) return "/invite/onboarding";

    return null;
  }

  /* =========================
     LOAD PROFILE
  ========================= */

  async function loadProfile(): Promise<AuthUser | null> {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        setAuthUser(null);
        return null;
      }

      const data: AuthUser = await res.json();

      setAuthUser(data);

      return data;
    } catch (err) {
      console.error("Auth load failed:", err);
      setAuthUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    loadProfile();
  }, []);

  /* =========================
     🔥 TRIGGER PUSH AFTER LOGIN (NEW)
  ========================= */

  useEffect(() => {
    if (authUser) {
      setupPush();
    }
  }, [authUser]);

  /* =========================
     LOGOUT
  ========================= */

  async function logout(): Promise<void> {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {}

    setAuthUser(null);
  }

  /* =========================
     REFRESH USER
  ========================= */

  async function refreshUser(): Promise<AuthUser | null> {
    setIsLoading(true);
    return loadProfile();
  }

  return (
    <UserAuthContext.Provider
      value={{
        authUser,
        isLoading,
        logout,
        refreshUser,
        getOnboardingStep,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useUserAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error(
      "useUserAuth must be used inside UserAuthProvider"
    );
  }

  return context;
}