import { useNavigate } from "react-router-dom";
import { useSwipes } from "../hooks/useSwipes";
import DataTable from "../components/DataTable";

// ✅ FIXED type (use real fields)
type Swipe = {
  id: string;
  liked?: boolean;
  superLike?: boolean;
  createdAt: string;
  swiper?: { email?: string };
  target?: { email?: string };
};

export default function AdminSwipesPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSwipes();

  const swipes: Swipe[] = data?.swipes ?? [];

  if (isLoading) {
    return <div className="glass-card p-4">Loading swipes…</div>;
  }

  if (error) {
    return <div className="glass-card p-4">Error loading swipes</div>;
  }

  return (
    <div className="page-wrapper fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Swipes
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "swiper" as any, label: "Swiper" },
          { key: "target" as any, label: "Target" },
          { key: "direction" as any, label: "Direction" },
          { key: "createdAt" as any, label: "Date" },
        ]}
        data={swipes.map((s: Swipe) => ({
          id: s.id,
          swiper: s.swiper?.email ?? "Unknown",
          target: s.target?.email ?? "Unknown",

          // ✅ REAL FIX
          direction: s.superLike
            ? "⭐ Super Like"
            : s.liked
            ? "❤️ Like"
            : "⛔ Pass",

          createdAt: new Date(s.createdAt).toLocaleString(),
        }))}
        onRowClick={(row: any) => navigate(`/admin/users/${row.id}`)}
      />
    </div>
  );
}