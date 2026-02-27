import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const dailyData = [
    { day: "Mon", value: 5 },
    { day: "Tue", value: 8 },
    { day: "Wed", value: 3 },
    { day: "Thu", value: 10 },
    { day: "Fri", value: 7 },
    { day: "Sat", value: 4 },
    { day: "Sun", value: 6 },
  ];

  const genderData = [
    { name: "Male", value: 40 },
    { name: "Female", value: 35 },
    { name: "Non-Binary", value: 25 },
  ];

  const roleData = [
    { name: "Admin", value: 10 },
    { name: "User", value: 70 },
    { name: "Moderator", value: 20 },
  ];

  const COLORS = ["#FFD700", "#8A2BE2", "#1E90FF"];

  return (
    <div style={{ padding: "0", color: "#fff" }}>
      <h1 style={{ fontSize: "2.1rem", marginBottom: "1.75rem" }}>
        Admin Dashboard
      </h1>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.75rem",
          marginBottom: "2.25rem",
        }}
      >
        <KPI title="Total Users" value="50" />
        <KPI title="Verified Users" value="41" />
        <KPI title="New Users (30d)" value="1" />
        <KPI title="New Users (Today)" value="0" />
        <KPI title="Total Matches" value="50" />
        <KPI title="Total Messages" value="50" />
      </div>

      {/* CHART GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: "2.25rem",
        }}
      >
        <ChartCard title="Daily Signups">
          <LineChartComponent data={dailyData} />
        </ChartCard>

        <ChartCard title="Daily Matches">
          <LineChartComponent data={dailyData} />
        </ChartCard>

        <ChartCard title="Daily Messages">
          <LineChartComponent data={dailyData} />
        </ChartCard>

        <ChartCard title="Gender Distribution">
          <PieChartComponent data={genderData} colors={COLORS} />
        </ChartCard>

        <ChartCard title="Role Distribution">
          <PieChartComponent data={roleData} colors={COLORS} />
        </ChartCard>
      </div>
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "1.6rem",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: "1.9rem", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        padding: "1.75rem",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.1)",
        height: "420px",
      }}
    >
      <h2 style={{ marginBottom: "1.1rem", fontSize: "1.25rem" }}>{title}</h2>
      <div style={{ width: "100%", height: "320px" }}>{children}</div>
    </div>
  );
}

function LineChartComponent({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="day" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={2.2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieChartComponent({
  data,
  colors,
}: {
  data: any[];
  colors: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
