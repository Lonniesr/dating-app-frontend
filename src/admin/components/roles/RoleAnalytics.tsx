import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

export default function RoleAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/roles/analytics");
      const payload = (res as any)?.data ?? res;
      setData(payload.roles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading role analytics…</div>;
  }

  if (!data.length) {
    return <div className="text-gray-500">No role analytics available</div>;
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10 mt-6">
      <div className="text-gray-300 font-medium mb-3">Role Analytics</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((r) => (
          <div
            key={r.id}
            className="bg-[#1a1a1a] p-3 rounded border border-yellow-500/10"
          >
            <div className="text-sm text-gray-300">{r.name}</div>
            <div className="text-xs text-gray-500 mb-1">
              {r.userCount} users
            </div>
            <div className="text-xs text-yellow-300">
              {r.percentage}% of active users
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
