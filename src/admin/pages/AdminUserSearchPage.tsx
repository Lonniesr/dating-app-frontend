import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import api from "../../services/apiClient"; // ✅ FIX

export default function AdminUserSearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["admin-user-search", submittedQuery],
    queryFn: async () => {
      if (!submittedQuery.trim()) return [];

      const res = await api.get("/api/admin/search", {
        params: { q: submittedQuery },
      });

      console.log("🔍 SEARCH RESULTS:", res.data); // ✅ DEBUG

      return res.data.results ?? [];
    },
    enabled: submittedQuery.trim().length > 0,
  });

  const handleSearch = () => {
    console.log("🔎 Searching for:", query);
    setSubmittedQuery(query);
  };

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer mb-6">
        User Search
      </h1>

      {/* SEARCH BAR */}
      <div className="glass-panel p-4 mb-6 flex gap-2">
        <input
          className="input"
          placeholder="Search by name, email, or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            color: "#fff",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />

        <button
          onClick={handleSearch}
          className="btn-gold px-4"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {isFetching && (
        <div className="glass-card">Searching…</div>
      )}

      {/* EMPTY STATE */}
      {!isFetching && submittedQuery && results.length === 0 && (
        <div className="glass-card text-white/60">
          No users found
        </div>
      )}

      {/* RESULTS */}
      {!isFetching && results.length > 0 && (
        <DataTable
          searchable={false}
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "id", label: "User ID" },
          ]}
          data={results}
          actions={[
            {
              label: "View",
              className: "btn-gold",
              onClick: (row) =>
                (window.location.href = `/admin/users/${row.id}`),
            },
          ]}
        />
      )}
    </div>
  );
}