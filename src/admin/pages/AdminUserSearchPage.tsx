import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import axios from "axios";

export default function AdminUserSearchPage() {
  const [query, setQuery] = useState("");

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["admin-user-search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const res = await axios.get("/api/admin/search", { params: { q: query } });
      return res.data.results ?? [];
    },
    enabled: query.trim().length > 0,
  });

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "1.5rem" }}>
        User Search
      </h1>

      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <input
          className="input"
          placeholder="Search by name, email, or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {isFetching && <div className="glass-card">Searching…</div>}

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
              onClick: (row) => (window.location.href = `/admin/users/${row.id}`),
            },
          ]}
        />
      )}
    </div>
  );
}
