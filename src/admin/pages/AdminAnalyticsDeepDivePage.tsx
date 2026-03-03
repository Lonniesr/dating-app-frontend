import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AdminAnalyticsDeepDivePage() {
  const [overview, setOverview] = useState<any>(null);
  const [dailyScans, setDailyScans] = useState<any[]>([]);
  const [dailyConversion, setDailyConversion] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const [o, scans, conv, dev, lead] = await Promise.all([
      axios.get(`${API}/api/admin/analytics/overview`, { withCredentials: true }),
      axios.get(`${API}/api/admin/analytics/daily-scans`, { withCredentials: true }),
      axios.get(`${API}/api/admin/analytics/daily-conversion`, { withCredentials: true }),
      axios.get(`${API}/api/admin/analytics/devices`, { withCredentials: true }),
      axios.get(`${API}/api/admin/analytics/leaderboard`, { withCredentials: true }),
    ]);

    setOverview(o.data);
    setDailyScans(scans.data);
    setDailyConversion(conv.data);
    setDevices(dev.data);
    setLeaderboard(lead.data);
  }

  if (!overview) return <div className="text-white">Loading analytics...</div>;

  return (
    <div className="space-y-12 text-white">

      {/* METRICS */}
      <div className="grid md:grid-cols-5 gap-6">
        <Metric label="Total Scans" value={overview.totalScans} />
        <Metric label="Total Signups" value={overview.totalSignups} />
        <Metric label="Conversion %" value={`${overview.conversionRate}%`} />
        <Metric label="Premium Signups" value={overview.premiumSignups} />
        <Metric label="Revenue" value={`$${overview.revenue}`} />
      </div>

      {/* DAILY SCANS */}
      <Section title="Daily Scan Growth">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyScans}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" stroke="#D4AF37" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* DAILY CONVERSION */}
      <Section title="Daily Signups">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyConversion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="signups" stroke="#00FFB2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* DEVICE BREAKDOWN */}
      <Section title="Device Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={devices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="device" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="_count.device" fill="#D4AF37" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* LEADERBOARD */}
      <Section title="Top Performing Invites">
        <div className="space-y-3">
          {leaderboard.map((invite, index) => (
            <div
              key={invite.code}
              className="flex justify-between bg-lynq-dark-2 p-4 rounded-xl border border-lynq-gray-2"
            >
              <div className="font-mono text-gold">
                #{index + 1} {invite.code}
              </div>
              <div className="text-sm text-gray-300">
                Scans: {invite.scanCount} | Signups: {invite.signupCount}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-lynq-dark-2 p-6 rounded-2xl border border-lynq-gray-2 text-center">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-semibold text-gold mt-2">{value}</div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gold">{title}</h2>
      <div className="bg-lynq-dark p-6 rounded-2xl border border-lynq-gray-2">
        {children}
      </div>
    </div>
  );
}