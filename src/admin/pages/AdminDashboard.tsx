import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const lineData = [
    { day: "Mon", users: 10 },
    { day: "Tue", users: 22 },
    { day: "Wed", users: 35 },
    { day: "Thu", users: 18 },
    { day: "Fri", users: 40 },
  ];

  const pieData = [
    { name: "Active", value: 400 },
    { name: "Inactive", value: 300 },
  ];

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "2rem" }}
      >
        Admin Dashboard
      </h1>

      {/* USER GROWTH */}
      <div className="glass-panel" style={{ marginBottom: "2rem" }}>
        <h2 className="h2">User Growth</h2>

        <div style={{ marginTop: "1.5rem" }}>
          <LineChart
            width={900}
            height={320}
            data={lineData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#d4af37"
              strokeWidth={3}
            />
          </LineChart>
        </div>
      </div>

      {/* USER STATUS */}
      <div className="glass-panel">
        <h2 className="h2">User Status</h2>

        <div style={{ marginTop: "1.5rem" }}>
          <PieChart width={900} height={320}>
            <Tooltip />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              fill="#d4af37"
              label
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
}