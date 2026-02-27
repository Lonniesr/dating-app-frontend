import { useNavigate } from "react-router-dom";
import { useSwipes } from "../hooks/useSwipes";
import DataTable from "../components/DataTable";

export default function AdminSwipesPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSwipes();

  const swipes = data?.swipes ?? [];

  if (isLoading) {
    return <div className="glass-card p-4">Loading swipes…</div>;
  }

  if (error) {
    return <div className="glass-card p-4">Error loading swipes</div>;
  }

  return (
    <div className="page-wrapper fade-in">
      <h1 className="admin-gold-shimmer" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Swipes
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "swiper", label: "Swiper" },
          { key: "target", label: "Target" },
          { key: "direction", label: "Direction" },
          { key: "createdAt", label: "Date" },
        ]}
        data={swipes.map((s) => ({
          id: s.id,
          swiper: s.swiper?.email ?? "Unknown",
          target: s.target?.email ?? "Unknown",
          direction: s.direction === "like" ? "❤️ Like" : "⛔ Pass",
          createdAt: new Date(s.createdAt).toLocaleString(),
        }))}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
      />
    </div>
  );
}
