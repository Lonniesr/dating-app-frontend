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

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    fetch(`/api/admin/swipe?limit=200&range=${range}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [range]);

  if (!data) {
    return <div className="p-10 text-white/60">Loading...</div>;
  }

  const { swipes, analytics } = data;

  /* ===============================
     📊 SWIPE GROUPING
  =============================== */
  const grouped: Record<string, number> = {};

  swipes.forEach((s: any) => {
    const day = new Date(s.createdAt).toLocaleDateString();
    grouped[day] = (grouped[day] || 0) + 1;
  });

  const lineData = Object.entries(grouped).map(([day, count]) => ({
    day,
    count,
  }));

  /* ===============================
     📊 LIKE VS PASS
  =============================== */
  const pieData = [
    { name: "Likes", value: analytics.likedSwipes },
    {
      name: "Passes",
      value: analytics.totalSwipes - analytics.likedSwipes,
    },
  ];

  /* ===============================
     📊 ELO DISTRIBUTION
  =============================== */
  const eloBuckets: Record<string, number> = {};

  swipes.forEach((s: any) => {
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

  swipes.forEach((s: any) => {
    if (s.swiper) usersMap[s.swiper.id] = s.swiper;
    if (s.target) usersMap[s.target.id] = s.target;
  });

  const topUsers = Object.values(usersMap)
    .sort((a: any, b: any) => (b.eloScore || 0) - (a.eloScore || 0))
    .slice(0, 6);

  /* ===============================
     💘 MATCH CONVERSION
  =============================== */
  const matchRate =
    analytics.totalSwipes > 0
      ? ((analytics.matches || 0) / analytics.totalSwipes) * 100
      : 0;

  return (
    <div className="p-8 text-white space-y-10">

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-gold-shimmer text-3xl"
      >
        Lynq Analytics
      </motion.h1>

      {/* FILTER */}
      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="glass-panel p-2"
      >
        <option value="1d">Last 24h</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      {/* KPI */}
      <div className="flex gap-6 flex-wrap">
        <KPI title="Total Swipes" value={analytics.totalSwipes} />
        <KPI title="Likes" value={analytics.likedSwipes} />
        <KPI title="Like Rate %" value={analytics.likeRate} />
        <KPI title="Match Rate %" value={matchRate.toFixed(2)} />
      </div>

      {/* SWIPE ACTIVITY */}
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

      {/* PIE */}
      <motion.div className="glass-panel">
        <h2>Likes vs Passes</h2>
        <PieChart width={500} height={300}>
          <Tooltip />
          <Pie data={pieData} dataKey="value" outerRadius={120} />
        </PieChart>
      </motion.div>

      {/* ELO DISTRIBUTION */}
      <motion.div className="glass-panel">
        <h2>Elo Distribution</h2>
        <BarChart width={800} height={300} data={eloData}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#d4af37" />
        </BarChart>
      </motion.div>

      {/* TOP PICKS */}
      <motion.div className="glass-panel">
        <h2>🔥 Top Picks</h2>

        <div className="flex gap-4 flex-wrap mt-4">
          {topUsers.map((user: any) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-4 w-44 text-center"
            >
              <img
                src={user.photo || "/placeholder.jpg"}
                className="rounded-lg mb-2"
              />
              <h3>{user.username || user.name}</h3>
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

/* KPI CARD */
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