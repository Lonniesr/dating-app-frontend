import { useQuery } from "@tanstack/react-query";
import BaseService from "@/admin/services/baseService";
const service = new BaseService("/api/admin/system/health");

const StatusBadge = ({ status }: { status: string }) => {
  const type =
    status === "OK"
      ? "badge-gold"
      : status === "DISABLED"
      ? "badge"
      : "badge-danger";

  return <span className={`badge ${type}`}>{status}</span>;
};

export default function AdminSystemStatusPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-system-status"],
    queryFn: async () => {
      const res = await service.get();
      return res.data;
    },
    refetchInterval: 30000, // 🔥 auto refresh every 30s
  });

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        System Status
      </h1>

      {isLoading && (
        <div className="glass-card">Checking system health…</div>
      )}

      {data && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="h2">Health Overview</h2>

          <div style={{ marginTop: "1.5rem", lineHeight: "2" }}>
            <div>
              <strong>API:</strong> <StatusBadge status={data.api} />
            </div>

            <div>
              <strong>Database:</strong> <StatusBadge status={data.db} />
            </div>

            <div>
              <strong>Redis:</strong> <StatusBadge status={data.redis} />
            </div>

            <div>
              <strong>Latency:</strong> {data.latency}ms
            </div>

            <div>
              <strong>Uptime:</strong>{" "}
              {Math.floor(data.uptime)} seconds
            </div>

            <div>
              <strong>Environment:</strong>{" "}
              <span className="badge">{data.environment}</span>
            </div>

            <div>
              <strong>Version:</strong>{" "}
              <span className="badge">{data.version}</span>
            </div>

            <div>
              <strong>CPU Load:</strong> {data.cpuLoad}
            </div>

            <div>
              <strong>Memory Used:</strong>{" "}
              {data.memory.usedMB} MB
            </div>

            <div>
              <strong>Total Memory:</strong>{" "}
              {data.memory.totalMB} MB
            </div>

            <div>
              <strong>Free Memory:</strong>{" "}
              {data.memory.freeMB} MB
            </div>
          </div>
        </div>
      )}
    </div>
  );
}