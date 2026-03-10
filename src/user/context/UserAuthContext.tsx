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
  minAge?: number;
  maxAge?: number;
  locationRadius?: number;
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