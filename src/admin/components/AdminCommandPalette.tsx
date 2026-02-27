import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNavItems } from "../core/AdminNavUtils";

export default function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const items = getAllNavItems();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        className="glass-panel"
        style={{ width: "480px", maxWidth: "90%", padding: "1rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          className="input"
          placeholder="Jump to page…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", marginBottom: "0.75rem" }}
        />
        <div style={{ maxHeight: "260px", overflowY: "auto" }}>
          {filtered.map((item) => (
            <div
              key={item.to}
              onClick={() => {
                navigate(item.to);
                setOpen(false);
              }}
              style={{
                padding: "0.5rem 0.25rem",
                cursor: "pointer",
              }}
            >
              {item.label}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ opacity: 0.6 }}>No matches</div>
          )}
        </div>
      </div>
    </div>
  );
}
