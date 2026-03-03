import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Invite {
  id: number;
  code: string;
  scanCount: number;
  signupCount: number;
  createdAt: string;
}

interface AnalyticsData {
  totalScans: number;
  totalSignups: number;
  conversionRate: number;
  invites: Invite[];
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [aRes, dRes] = await Promise.all([
        fetch("/api/admin/analytics/invites", { credentials: "include" }),
        fetch("/api/admin/analytics/devices", { credentials: "include" }),
      ]);

      const analyticsData = await aRes.json();
      const deviceData = await dRes.json();

      const formattedDevices = deviceData.map((d: any) => ({
        name: d.device || "unknown",
        value: d._count.device,
      }));

      setAnalytics(analyticsData);
      setDevices(formattedDevices);
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-gold">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-red-400">Failed to load analytics</div>;
  }

  const topInvites = [...analytics.invites]
    .sort((a, b) => b.signupCount - a.signupCount)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-12">

      {/* TOP METRICS */}
      <div className="grid md:grid-cols-3 gap-8">
        <MetricCard label="Total Scans" value={analytics.totalScans} />
        <MetricCard label="Total Signups" value={analytics.totalSignups} />
        <MetricCard
          label="Conversion Rate"
          value={`${analytics.conversionRate}%`}
        />
      </div>

      {/* DEVICE BREAKDOWN */}
      <div className="bg-lynq-dark-2 p-8 rounded-3xl border border-lynq-gray-2 shadow-card">
        <h2 className="text-xl text-gold mb-6">Device Breakdown</h2>

        <div className="h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={devices}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {devices.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#D4AF37", "#444", "#777", "#999"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP INVITES */}
      <div className="bg-lynq-dark-2 p-8 rounded-3xl border border-lynq-gray-2 shadow-card">
        <h2 className="text-xl text-gold mb-6">Top Performing Invites</h2>

        <div className="h-96">
          <ResponsiveContainer>
            <BarChart data={topInvites}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="code" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="signupCount" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gradient-to-br from-lynq-dark-2 to-lynq-dark p-8 rounded-3xl border border-gold/20 shadow-card">
      <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="text-3xl font-semibold text-gold">{value}</div>
    </div>
  );
}