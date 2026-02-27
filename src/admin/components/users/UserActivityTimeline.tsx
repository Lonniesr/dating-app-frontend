import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";

interface UserActivityTimelineProps {
  userId: string;
}

interface ActivityEvent {
  type: string;
  description: string;
  timestamp: string;
}

export default function UserActivityTimeline({ userId }: UserActivityTimelineProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/users/${userId}/timeline`);
      const payload = (res as any)?.data ?? res;
      setEvents(payload.timeline || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading timeline…</div>;
  }

  if (events.length === 0) {
    return <div className="text-gray-500">No activity recorded</div>;
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10">
      <div className="text-gray-300 font-medium mb-3">Activity Timeline</div>

      <div className="space-y-4">
        {events.map((e, i) => (
          <div
            key={i}
            className="border-l border-yellow-500/20 pl-4 relative"
          >
            <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(255,215,0,0.6)]" />

            <div className="text-yellow-300 text-sm font-medium">
              {e.type}
            </div>
            <div className="text-gray-400 text-sm">{e.description}</div>
            <div className="text-gray-500 text-xs mt-1">{e.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
