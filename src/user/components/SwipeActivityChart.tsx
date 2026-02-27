import { useSwipeStats } from "../hooks/useSwipeStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ActivityEntry = {
  createdAt: string;
  _count: number;
};

type ActivityPoint = {
  date: string;
  count: number;
};

export default function SwipeActivityChart() {
  const { data, isLoading } = useSwipeStats();

  if (isLoading) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white/60 mb-6">
        Loading activity chart…
      </div>
    );
  }

  if (!data?.activity || data.activity.length === 0) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white/60 mb-6">
        No swipe activity yet.
      </div>
    );
  }

  const chartData: ActivityPoint[] = data.activity.map(
    (entry: ActivityEntry) => ({
      date: new Date(entry.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: entry._count,
    })
  );

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white mb-6">
      <h2 className="text-xl font-bold mb-4">
        Swipe Activity (Last 7 Days)
      </h2>

      {/* Responsive chart container using aspect ratio */}
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />

          <XAxis dataKey="date" stroke="#aaa" />

          <YAxis stroke="#aaa" />

          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#4f9cff"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4f9cff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}