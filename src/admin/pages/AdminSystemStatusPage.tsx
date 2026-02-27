import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AdminSystemStatusPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-system-status"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/system-status");
      return res.data;
    },
  });

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        System Status
      </h1>

      {isLoading && <div className="glass-card">Checking system health…</div>}

      {!isLoading && data && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="h2">Health Overview</h2>

          <div style={{ marginTop: "1rem", lineHeight: "1.8" }}>
            <div><strong>API Status:</strong> {data.apiStatus}</div>
            <div><strong>Database:</strong> {data.databaseStatus}</div>
            <div><strong>Uptime:</strong> {data.uptime}</div>
            <div><strong>Environment:</strong> {data.environment}</div>
            <div><strong>Latency:</strong> {data.latency}ms</div>
          </div>
        </div>
      )}
    </div>
  );
}
