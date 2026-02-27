import { useTheme } from "../core/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumb = location.pathname
    .replace("/admin", "")
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header
      style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "var(--lynq-dark-2)",
      }}
    >
      <div style={{ fontSize: "1rem", color: "var(--lynq-text-muted)" }}>
        Admin {breadcrumb ? `/ ${breadcrumb}` : "/ Dashboard"}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "6px 12px",
            borderRadius: "8px",
            color: "var(--lynq-text)",
            cursor: "pointer",
          }}
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "6px 12px",
            borderRadius: "8px",
            color: "var(--lynq-text)",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
