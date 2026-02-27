import { useLocation } from "react-router-dom";
import { findNavItem } from "../core/AdminNavUtils";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const match = findNavItem(pathname);

  return (
    <div
      className="glass-card"
      style={{
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        fontSize: "0.9rem",
        display: "flex",
        gap: "0.5rem",
      }}
    >
      <span style={{ opacity: 0.7 }}>Admin</span>
      {match && (
        <>
          <span>/</span>
          <span className="admin-gold-shimmer">{match.breadcrumb}</span>
        </>
      )}
    </div>
  );
}
