import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

export default function RoleActivityLog() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/admin/roles/activity");
      const payload = (res as any)?.data ?? res;
      setEvents(payload.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500 mt-4">Loading role activity…</div>;
  }

  if (!events.length) {
    return <div className="text-gray-500 mt-4">No recent role activity</div>;
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10 mt-6">
      <div className="text-gray-300 font-medium mb-3">Role Activity</div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {events.map((e, i) => (
          <div
            key={i}
            className="border-l border-yellow-500/20 pl-3 relative"
          >
            <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
            <div className="text-sm text-gray-200">{e.action}</div>
            <div className="text-xs text-gray-500">
              {e.admin} • {e.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
