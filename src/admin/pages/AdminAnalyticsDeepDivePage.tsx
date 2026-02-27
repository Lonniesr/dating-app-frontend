import { useQuery } from "@tanstack/react-query";
import { adminStatsService } from "../services/adminStatsService";
import { Line, Pie } from "react-chartjs-2";

export default function AdminAnalyticsDeepDivePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminStatsService.get(),
  });

  if (isLoading) {
    return <div className="glass-card">Loading analytics…</div>;
  }

  const { charts, distribution } = stats;

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Analytics Deep Dive
      </h1>

      <div className="chart-grid">
        <div className="glass-panel chart">
          <h2 className="h2">Daily Signups</h2>
          <Line
            data={{
              labels: charts.dailySignups.map((d) => d.date),
              datasets: [
                {
                  label: "Signups",
                  data: charts.dailySignups.map((d) => d.count),
                  borderColor: "var(--lynq-gold)",
                },
              ],
            }}
          />
        </div>

        <div className="glass-panel chart">
          <h2 className="h2">Daily Matches</h2>
          <Line
            data={{
              labels: charts.dailyMatches.map((d) => d.date),
              datasets: [
                {
                  label: "Matches",
                  data: charts.dailyMatches.map((d) => d.count),
                  borderColor: "var(--lynq-gold)",
                },
              ],
            }}
          />
        </div>

        <div className="glass-panel chart">
          <h2 className="h2">Daily Messages</h2>
          <Line
            data={{
              labels: charts.dailyMessages.map((d) => d.date),
              datasets: [
                {
                  label: "Messages",
                  data: charts.dailyMessages.map((d) => d.count),
                  borderColor: "var(--lynq-gold)",
                },
              ],
            }}
          />
        </div>

        <div className="glass-panel chart">
          <h2 className="h2">Gender Distribution</h2>
          <Pie
            data={{
              labels: distribution.gender.map((g) => g.gender),
              datasets: [
                {
                  data: distribution.gender.map((g) => g._count.gender),
                  backgroundColor: ["#e8c547", "#6a4c93", "#1982c4"],
                },
              ],
            }}
          />
        </div>

        <div className="glass-panel chart">
          <h2 className="h2">Role Distribution</h2>
          <Pie
            data={{
              labels: distribution.roles.map((r) => r.role),
              datasets: [
                {
                  data: distribution.roles.map((r) => r._count.role),
                  backgroundColor: ["#e8c547", "#6a4c93", "#1982c4"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
