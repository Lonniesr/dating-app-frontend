import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

const API = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL =", API);

export type Preferences = {
  interestedIn: string;
  racePreference: string | null;
  minAge: number;
  maxAge: number;
  locationRadius: number;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  onboardingComplete?: boolean;
  photos?: string[];
  gender?: string;
  location?: string;
  birthdate?: string;
  preferences?: Preferences | null;
  prompts?: string | null;
};

export type UserAuthContextValue = {
  authUser: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

export const UserAuthContext =
  createContext<UserAuthContextValue | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const parsePreferences = (raw: unknown): Preferences | null => {
    if (!raw) return null;

    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }

    if (typeof raw === "object") {
      return raw as Preferences;
    }

    return null;
  };

  const fetchMe = async (): Promise<AuthUser | null> => {
    try {
      const res = await fetch(`${API}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setAuthUser(null);
        return null;
      }

      // ✅ FIX: backend returns user directly
      const rawUser = await res.json();

      if (!rawUser) {
        setAuthUser(null);
        return null;
      }

      const parsedUser: AuthUser = {
        ...rawUser,
        preferences: parsePreferences(rawUser.preferences),
      };

      setAuthUser(parsedUser);
      return parsedUser;
    } catch (err) {
      console.error("Error fetching /api/me:", err);
      setAuthUser(null);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchMe();
      setIsLoading(false);
    })();
  }, []);

  const refreshUser = async () => {
    return await fetchMe();
  };

  const logout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthUser(null);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        authUser,
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth(): UserAuthContextValue {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }

  return context;
}