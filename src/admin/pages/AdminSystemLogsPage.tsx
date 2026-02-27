import { useQuery } from "@tanstack/react-query";

interface LogEntry {
  id: string;
  action: string;
  admin: string;
  target: string | null;
  createdAt: string;
}

export default function AdminSystemLogsPage() {
  // Placeholder until backend exists
  const { data: logs = [], isLoading } = useQuery<LogEntry[]>({
    queryKey: ["admin-logs"],
    queryFn: async () => {
      return [
        {
          id: "1",
          action: "Approved verification",
          admin: "Admin A",
          target: "User 123",
          createdAt: new Date().toISOString(),
        },
      ];
    },
  });

  if (isLoading) {
    return <div className="glass-card">Loading logs…</div>;
  }

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        System Logs
      </h1>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.admin}</td>
                <td>{log.target ?? "—"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
