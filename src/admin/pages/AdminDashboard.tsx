import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/swipe?limit=200&range=${range}`, {
      credentials: "include", // 🔥 REQUIRED
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Request failed");
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Unauthorized or failed to load dashboard");
      });
  }, [range]);

  /* ===============================
     ERROR STATE
  =============================== */
  if (error) {
    return (
      <div className="p-10 text-red-400">
        {error}
      </div>
    );
  }

  /* ===============================
     LOADING STATE
  =============================== */
  if (!data || !data.swipes) {
    return (
      <div className="p-10 text-white/60">
        Loading dashboard...
      </div>
    );
  }

  const { swipes, analytics } = data;

  /* ===============================
     📊 SAFE GROUPING
  =============================== */
  const grouped: Record<string, number> = {};

  (swipes || []).forEach((s: any) => {
    if (!s?.createdAt) return;
    const day = new Date(s.createdAt).toLocaleDateString();
    grouped[day] = (grouped[day] || 0) + 1;
  });

  const lineData = Object.entries(grouped).map(([day, count]) => ({
    day,
    count,
  }));

  /* ===============================
     📊 PIE
  =============================== */
  const pieData = [
    { name: "Likes", value: analytics?.likedSwipes || 0 },
    {
      name: "Passes",
      value:
        (analytics?.totalSwipes || 0) -
        (analytics?.likedSwipes || 0),
    },
  ];

  /* ===============================
     📊 ELO DISTRIBUTION
  =============================== */
  const eloBuckets: Record<string, number> = {};

  (swipes || []).forEach((s: any) => {
    const users = [s.swiper, s.target];

    users.forEach((u) => {
      if (!u) return;
      const bucket = Math.floor((u.eloScore || 1000) / 100) * 100;
      eloBuckets[bucket] = (eloBuckets[bucket] || 0) + 1;
    });
  });

  const eloData = Object.entries(eloBuckets).map(([range, count]) => ({
    range,
    count,
  }));

  /* ===============================
     ⭐ TOP PICKS
  =============================== */
  const usersMap: Record<string, any> = {};

  (swipes || []).forEach((s: any) => {
    if (s.swiper) usersMap[s.swiper.id] = s.swiper;
    if (s.target) usersMap[s.target.id] = s.target;
  });

  const topUsers = Object.values(usersMap)
    .sort((a: any, b: any) => (b.eloScore || 0) - (a.eloScore || 0))
    .slice(0, 6);

  /* ===============================
     💘 MATCH RATE
  =============================== */
  const matchRate =
    analytics?.totalSwipes > 0
      ? ((analytics?.matches || 0) / analytics.totalSwipes) * 100
      : 0;

  return (
    <div className="p-8 text-white space-y-10">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-gold-shimmer text-3xl"
      >
        Lynq Analytics
      </motion.h1>

      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="glass-panel p-2"
      >
        <option value="1d">Last 24h</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      <div className="flex gap-6 flex-wrap">
        <KPI title="Total Swipes" value={analytics.totalSwipes} />
        <KPI title="Likes" value={analytics.likedSwipes} />
        <KPI title="Like Rate %" value={analytics.likeRate} />
        <KPI title="Match Rate %" value={matchRate.toFixed(2)} />
      </div>

      <motion.div className="glass-panel">
        <h2>Swipe Activity</h2>
        <LineChart width={800} height={300} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line dataKey="count" stroke="#d4af37" />
        </LineChart>
      </motion.div>

      <motion.div className="glass-panel">
        <h2>Likes vs Passes</h2>
        <PieChart width={500} height={300}>
          <Tooltip />
          <Pie data={pieData} dataKey="value" outerRadius={120} />
        </PieChart>
      </motion.div>

      <motion.div className="glass-panel">
        <h2>Elo Distribution</h2>
        <BarChart width={800} height={300} data={eloData}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#d4af37" />
        </BarChart>
      </motion.div>

      <motion.div className="glass-panel">
        <h2>🔥 Top Picks</h2>

        <div className="flex gap-4 flex-wrap mt-4">
          {topUsers.map((user: any) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-4 w-44 text-center"
            >
              <h3>{user.name || "User"}</h3>
              <p className="text-sm opacity-60">
                ⭐ {user.eloScore || 1000}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}

function KPI({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-panel p-4 min-w-[160px]"
    >
      <p className="opacity-60 text-sm">{title}</p>
      <h2 className="text-2xl">{value}</h2>
    </motion.div>
  );
}