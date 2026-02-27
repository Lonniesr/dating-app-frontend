// src/admin/components/charts/LikesPerMinuteChart.tsx

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface LikesPerMinuteChartProps {
  value: number | null;
}

export default function LikesPerMinuteChart({
  value,
}: LikesPerMinuteChartProps) {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    if (value === null) return;

    const now = new Date();
    const label = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setData((prev) => {
      const updated = [...prev, { time: label, value }];
      if (updated.length > 20) updated.shift();
      return updated;
    });
  }, [value]);

  return (
    // FIX: Give the chart wrapper a guaranteed height BEFORE ResponsiveContainer mounts
    <div className="w-full h-full min-h-[260px] flex">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            stroke="#ffffff"
            strokeOpacity={0.25}
            strokeDasharray="4 4"
          />

          <XAxis dataKey="time" stroke="#cccccc" tick={{ fill: "#cccccc" }} />

          <YAxis
            stroke="#cccccc"
            tick={{ fill: "#cccccc" }}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              background: "#222",
              border: "1px solid #444",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
