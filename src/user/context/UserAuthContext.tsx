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
  bio?: string;
  gender?: string;

  verified?: boolean;
  verification_status?: "none" | "pending" | "approved" | "rejected";

  photos?: string[];

  preferences?: Preferences;
};

type AuthContextType = {
  authUser: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const UserAuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Auth failed");
      }

      const data = await res.json();

      setAuthUser(data);
    } catch (err) {
      console.error("Auth load failed:", err);

      localStorage.removeItem("token");
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setAuthUser(null);
  }

  return (
    <UserAuthContext.Provider
      value={{
        authUser,
        isLoading,
        logout,
        refreshUser: loadProfile,
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