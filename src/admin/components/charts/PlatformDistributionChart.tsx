// src/admin/components/charts/PlatformDistributionChart.tsx

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PlatformDistributionChartProps {
  data: { platform: string; value: number }[] | null;
}

const COLORS = ["#d4af37", "#b8962e", "#8c6f23", "#f5d98c"];

const tooltipStyle = {
  backgroundColor: "#111111",
  border: "1px solid #d4af37",
  borderRadius: "6px",
  color: "#d4af37",
  padding: "8px 12px",
};

export default function PlatformDistributionChart({
  data,
}: PlatformDistributionChartProps) {
  const safeData = data || [];

  return (
    // FIX: Give the chart wrapper a guaranteed height BEFORE ResponsiveContainer mounts
    <div className="w-full h-full min-h-[260px] flex">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={safeData}
            dataKey="value"
            nameKey="platform"
            outerRadius="80%"
            innerRadius="45%"
            stroke="#0b0b0b"
            strokeWidth={2}
            label={(entry) => `${entry.platform}: ${entry.value}`}
            labelStyle={{ fill: "#d4af37", fontSize: 12 }}
          >
            {safeData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#d4af37" }}
            labelStyle={{ color: "#f5d98c" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
