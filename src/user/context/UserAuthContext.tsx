import { createContext, useContext, useEffect, useState } from "react";

type Preferences = {
  interestedIn?: string;
  minAge?: number;
  maxAge?: number;
  locationRadius?: number;
};

type AuthUser = {
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

type AuthContextType = {
  authUser: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
};

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile(): Promise<AuthUser | null> {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Auth failed");
      }

      const data = await res.json();

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

  useEffect(() => {
    loadProfile();
  }, []);

  function logout() {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    setAuthUser(null);
  }

  async function refreshUser() {
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
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("useUserAuth must be used inside UserAuthProvider");
  }

  return context;
}