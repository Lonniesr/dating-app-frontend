import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* =========================
   USER TYPES
========================= */

type Preferences = {
  interestedIn?: string;
  racePreference?: string | null;
  minAge?: number;
  maxAge?: number;
  locationRadius?: number | null;
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

  prompts?: Record<string, any>;

  preferences?: Preferences;

  verified?: boolean;
  verification_status?: "none" | "pending" | "approved" | "rejected";

  onboardingComplete?: boolean;
  lastActiveAt?: string;
};

/* =========================
   CONTEXT TYPES
========================= */

type AuthContextType = {
  authUser: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
};

/* =========================
   CONTEXT
========================= */

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
     ONBOARDING STEP DETECTION
  ========================= */

  function redirectToOnboardingStep(user: AuthUser) {
    if (user.role === "admin") return;

    if (user.onboardingComplete) return;

    const hasBasic =
      !!user.name &&
      !!user.birthdate &&
      !!user.gender;

    const hasPreferences =
      !!user.preferences &&
      Object.keys(user.preferences).length > 0;

    const hasPhotos =
      Array.isArray(user.photos) &&
      user.photos.length > 0;

    const hasPrompts =
      !!user.prompts &&
      Object.keys(user.prompts).length > 0;

    if (!hasBasic) {
      window.location.replace("/invite/onboarding/basic");
      return;
    }

    if (!hasPreferences) {
      window.location.replace("/invite/onboarding/preferences");
      return;
    }

    if (!hasPhotos) {
      window.location.replace("/invite/onboarding/photos");
      return;
    }

    if (!hasPrompts) {
      window.location.replace("/invite/onboarding/personality");
      return;
    }

    window.location.replace("/invite/onboarding/complete");
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

      redirectToOnboardingStep(data);

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
    } catch {
      // ignore logout errors
    }

    setAuthUser(null);
  }

  /* =========================
     REFRESH USER
  ========================= */

  async function refreshUser(): Promise<AuthUser | null> {
    setIsLoading(true);
    return loadProfile();
  }

  /* =========================
     CONTEXT PROVIDER
  ========================= */

  return (
    <UserAuthContext.Provider
      value={{
        authUser,
        isLoading,
        logout,
        refreshUser,
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