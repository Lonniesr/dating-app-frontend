import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface ThemeValues {
  primary: string;
  background: string;
  surface: string;
  text: string;
  radius: number;
  scale: number;
}

const defaultTheme: ThemeValues = {
  primary: "#d4af37",
  background: "#0d0d0d",
  surface: "#1a1a1a",
  text: "#ffffff",
  radius: 12,
  scale: 1,
};

const ThemeContext = createContext<ThemeValues>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeValues>(defaultTheme);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    axios
      .get(import.meta.env.VITE_API_URL + "/api/admin/settings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        validateStatus: () => true,
      })
      .then((res) => {
        if (res.status !== 200 || !res.data?.settings) return;

        const s = res.data.settings;

        const newTheme: ThemeValues = {
          primary: "#d4af37",
          background: s.theme === "dark" ? "#0d0d0d" : "#f5f5f5",
          surface: s.theme === "dark" ? "#1a1a1a" : "#ffffff",
          text: s.theme === "dark" ? "#ffffff" : "#000000",
          radius: 12,
          scale: 1,
        };

        setTheme(newTheme);

        // Apply CSS variables globally
        document.documentElement.style.setProperty("--bg", newTheme.background);
        document.documentElement.style.setProperty("--surface", newTheme.surface);
        document.documentElement.style.setProperty("--text", newTheme.text);
        document.documentElement.style.setProperty("--primary", newTheme.primary);

        document.documentElement.classList.add("lynq-theme");
      })
      .catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
