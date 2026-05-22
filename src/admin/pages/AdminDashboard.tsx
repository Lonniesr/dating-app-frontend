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
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/swipe?limit=200&range=${range}`, {
      credentials: "include",
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

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  if (!data || !data.swipes) {
    return <div className="p-10 text-white/60">Loading dashboard...</div>;
  }

  const { swipes, analytics } = data;

  /* ===============================
     📊 GROUPING
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
     📊 ELO FIXED BUCKETS
  =============================== */
  const bucketRanges = ["0-500", "500-1000", "1000-1500", "1500-2000", "2000+"];

  const eloData = bucketRanges.map((range) => ({
    range,
    count: 0,
  }));

  (swipes || []).forEach((s: any) => {
    const users = [s.swiper, s.target];

    users.forEach((u) => {
      if (!u) return;
      const score = u.eloScore || 1000;

      if (score < 500) eloData[0].count++;
      else if (score < 1000) eloData[1].count++;
      else if (score < 1500) eloData[2].count++;
      else if (score < 2000) eloData[3].count++;
      else eloData[4].count++;
    });
  });

  /* ===============================
     ⭐ TOP PICKS
  =============================== */
  const usersMap: Record<string, any> = {};

  (swipes || []).forEach((s: any) => {
    if (s.swiper) usersMap[s.swiper.id] = s.swiper;
    if (s.target) usersMap[s.target.id] = s.target;
  });

  const topUsers = Object.values(usersMap)
  .map((user: any) => {
    const matches = user.matches || 0;
    const elo = user.eloScore || 1000;

    const lastActive = user.lastActiveAt
  ? new Date(user.lastActiveAt)
  : new Date();

const hoursInactive =
  (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);

// 🔥 DECAY
const decay = hoursInactive * 0.5;

// 🔥 FINAL SCORE
const score =
  (matches * 3) +
  (elo / 100) +
  ((user.trending || 0) * 5) - // boost active users
  decay;

    return { ...user, score };
  })
  .sort((a: any, b: any) => b.score - a.score)
  .slice(0, 6);

  /* ===============================
     💘 MATCH RATE
  =============================== */
  const matchRate =
    analytics?.totalSwipes > 0
      ? ((analytics?.matches || 0) / analytics.totalSwipes) * 100
      : 0;

  return (
    <div className="p-8 text-white space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Lynq Analytics</h1>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="glass-panel p-2"
        >
          <option value="1d">Last 24h</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Total Swipes" value={analytics.totalSwipes} />
        <KPI title="Likes" value={analytics.likedSwipes} />
        <KPI title="Like Rate %" value={analytics.likeRate} />
        <KPI title="Match Rate %" value={matchRate.toFixed(2)} />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* SWIPE CHART */}
          <div className="glass-panel p-6">
            <h2 className="mb-4">Swipe Activity</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <defs>
                  <linearGradient id="colorSwipes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#d4af37"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  fill="url(#colorSwipes)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PIE + ELO */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="glass-panel p-6">
              <h2 className="mb-4">Likes vs Passes</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-xl"
                  >
                    {analytics.likedSwipes}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel p-6">
              <h2 className="mb-4">Elo Distribution</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eloData}>
                  <XAxis dataKey="range" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#d4af37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-lg font-semibold">Activity Overview</h3>

          <Stat label="Total Swipes" value={analytics.totalSwipes} />
          <Stat label="Likes" value={analytics.likedSwipes} />
          <Stat label="Matches" value={analytics.matches || 0} />
          <Stat label="Match Rate" value={`${matchRate.toFixed(2)}%`} />
        </div>

      </div>

      {/* TOP PICKS */}
<div className="glass-panel p-6">
  <h2 className="mb-4">🔥 Top Picks</h2>

  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
    {topUsers.map((user: any, index: number) => {
      const matches = user.matches || 0;
      const isTrending = (user.trending || 0) >= 1;
      // 🔥 BADGES LOGIC
      let badge = null;
      if (matches >= 8) badge = "💎 Elite";
      else if (matches >= 5) badge = "🔥 Hot";
      else if (matches >= 2) badge = "⚡ Rising";

      return (
        <div
          key={user.id}
          className={`glass-panel p-4 text-center ${
  index === 0
    ? "ring-2 ring-yellow-400 scale-105"
    : index === 1
    ? "ring-2 ring-gray-400"
    : index === 2
    ? "ring-2 ring-orange-400"
    : ""
}`}
        >
          {/* 🔢 RANK */}
          <p className="text-xs text-white/40 mb-1">
            #{index + 1}
          </p>

          {/* ✅ AVATAR */}
          <img
            src={
              user.photos?.[0]?.url
                ? user.photos[0].url
                : "/placeholder.png"
            }
            className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border border-white/10"
          />

          {/* 🏷 BADGE */}
          {badge && (
            <p className="text-[10px] font-semibold text-yellow-400 mb-1">
  {badge}
</p>
          )}

          {isTrending && (
  <p className="text-[10px] text-green-400">
    📈 Trending
  </p>
)}

          <h3 className="font-semibold">
            {user.username || user.name || "User"}
          </h3>

          <p className="text-xs text-white/50">
            Matches: {matches}
          </p>

          <p className="text-yellow-400 text-sm">
            ⭐ {user.eloScore || 1000}
          </p>

          {/* 🔥 SCORE */}
          <p className="text-xs text-white/40">
            Score: {Math.round(user.score)}
          </p>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
}

/* KPI */
function KPI({ title, value }: any) {
  return (
    <div className="glass-panel p-5 rounded-xl border border-white/10 bg-white/5">
      <p className="text-sm text-white/60">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
      <p className="text-green-400 text-xs mt-1">↑ growing</p>
    </div>
  );
}

/* STAT */
function Stat({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}