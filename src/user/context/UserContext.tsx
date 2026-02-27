import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  photos?: string[];
  onboardingComplete?: boolean;
  birthdate?: string;
  preferences?: string | null;
  prompts?: string | null;
}

interface UserContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/me`, // ✅ FIXED
          {
            credentials: "include",
          }
        );

        if (!mounted) return;

        if (!res.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? null);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error("Error fetching /api/me:", err);
        setUser(null);
        setLoading(false);
      }
    };

    fetchMe();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within <UserProvider>");
  }
  return ctx;
}