import { useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";

interface UserAnalyticsProps {
  userId: string;
}

interface AnalyticsData {
  matches: number;
  swipes: number;
  likes: number;
  messages: number;
  lastActive: string;
  joined: string;
}

export default function UserAnalytics({ userId }: UserAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/users/${userId}/analytics`);
      const payload = (res as any)?.data ?? res;
      setData(payload.analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div className="text-gray-500">Loading analytics…</div>;
  }

  return (
    <div className="bg-[#111] p-4 rounded-lg border border-yellow-500/10">
      <div className="text-gray-300 font-medium mb-3">Analytics</div>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="Matches" value={data.matches} />
        <Stat label="Swipes" value={data.swipes} />
        <Stat label="Likes" value={data.likes} />
        <Stat label="Messages" value={data.messages} />
        <Stat label="Last Active" value={data.lastActive} />
        <Stat label="Joined" value={data.joined} />
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string | number;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="bg-[#1a1a1a] p-3 rounded border border-yellow-500/10">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg text-yellow-300 font-semibold">{value}</div>
    </div>
  );
}
