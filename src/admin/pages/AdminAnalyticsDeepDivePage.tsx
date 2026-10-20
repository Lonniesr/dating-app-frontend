import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";

const API = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const DAY_MS = 86_400_000;

const numberFormat = new Intl.NumberFormat("en-US");
const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const shortDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const tooltipStyle = {
  backgroundColor: "#171717",
  border: "1px solid #444",
  borderRadius: 12,
  color: "#fff",
};

type Overview = {
  totalScans: number;
  totalSignups: number;
  conversionRate: number;
  premiumSignups: number;
  revenue: number;
  estimatedRevenue?: number;
  asOf?: string;
};

type DailyScan = {
  date: string;
  scans: number;
};

type DailySignup = {
  date: string;
  signups: number;
};

type Device = {
  device: string | null;
  _count: { device: number };
};

type Invite = {
  code: string;
  scanCount: number;
  signupCount: number;
  premium: boolean;
};

type AnalyticsState = {
  overview: Overview | null;
  scans: DailyScan[];
  signups: DailySignup[];
  devices: Device[];
  leaderboard: Invite[];
  errors: {
    overview?: string;
    scans?: string;
    devices?: string;
    leaderboard?: string;
  };
  signupMessage: string;
};

type Range = "7" | "30" | "90" | "all";

const initialState: AnalyticsState = {
  overview: null,
  scans: [],
  signups: [],
  devices: [],
  leaderboard: [],
  errors: {},
  signupMessage: "",
};

function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateTimestamp(date: string): number {
  return Date.parse(`${date}T00:00:00.000Z`);
}

function isValidDay(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const timestamp = dateTimestamp(date);

  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === date
  );
}

function formatDay(date: string): string {
  return shortDateFormat.format(new Date(dateTimestamp(date)));
}

function formatTick(value: unknown): string {
  return typeof value === "string" && isValidDay(value)
    ? formatDay(value)
    : String(value);
}

function isCount(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function validateOverview(data: Overview): Overview {
  if (
    !data ||
    !isCount(data.totalScans) ||
    !isCount(data.totalSignups) ||
    !isCount(data.premiumSignups) ||
    !Number.isFinite(data.conversionRate) ||
    data.conversionRate < 0 ||
    !Number.isFinite(data.estimatedRevenue ?? data.revenue) ||
    (data.estimatedRevenue ?? data.revenue) < 0
  ) {
    throw new Error("Invalid overview response");
  }

  return data;
}

function normalizeScans(data: DailyScan[]): DailyScan[] {
  if (!Array.isArray(data)) {
    throw new Error("Invalid scan response");
  }

  const counts = new Map<string, number>();

  for (const row of data) {
    if (!row || !isValidDay(row.date) || !isCount(row.scans)) {
      throw new Error("Invalid daily scan record");
    }

    counts.set(row.date, (counts.get(row.date) ?? 0) + row.scans);
  }

  const dates = [...counts.keys()].sort();
  if (dates.length === 0) return [];

  const today = utcToday();

  if (dates[dates.length - 1] > today) {
    throw new Error("Daily scan response contains future dates");
  }

  const result: DailyScan[] = [];

  for (
    let timestamp = dateTimestamp(dates[0]);
    timestamp <= dateTimestamp(today);
    timestamp += DAY_MS
  ) {
    const date = new Date(timestamp).toISOString().slice(0, 10);
    result.push({ date, scans: counts.get(date) ?? 0 });
  }

  return result;
}

function normalizeSignups(data: DailySignup[]): DailySignup[] {
  if (!Array.isArray(data)) throw new Error("Invalid signup response");

  const rows = data.map((row) => {
    if (!row || !isValidDay(row.date) || !isCount(row.signups)) {
      throw new Error("Invalid signup record");
    }
    return { date: row.date, scans: row.signups };
  });

  return normalizeScans(rows).map((row) => ({
    date: row.date,
    signups: row.scans,
  }));
}

function normalizeDevices(data: Device[]) {
  if (!Array.isArray(data)) {
    throw new Error("Invalid device response");
  }

  const counts = new Map<string, number>();

  for (const row of data) {
    if (
      !row ||
      (row.device !== null && typeof row.device !== "string") ||
      !isCount(row._count?.device)
    ) {
      throw new Error("Invalid device record");
    }

    const device = row.device?.trim().toLowerCase() || "unknown";
    counts.set(device, (counts.get(device) ?? 0) + row._count.device);
  }

  return [...counts].map(([device, count]) => ({
    device,
    _count: { device: count },
  })).sort(
    (a, b) =>
      b._count.device - a._count.device ||
      a.device.localeCompare(b.device)
  );
}

function validateLeaderboard(data: Invite[]): Invite[] {
  if (
    !Array.isArray(data) ||
    data.some(
      (row) =>
        !row ||
        typeof row.code !== "string" ||
        !isCount(row.scanCount) ||
        !isCount(row.signupCount)
    )
  ) {
    throw new Error("Invalid leaderboard response");
  }

  return data;
}

export default function AdminAnalyticsDeepDivePage() {
  const [analytics, setAnalytics] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("30");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setLoading(true);

      const options = {
        withCredentials: true,
        signal: controller.signal,
        timeout: 20_000,
      };

      const results = await Promise.allSettled([
        axios
          .get<Overview>(`${API}/api/admin/analytics/overview`, options)
          .then(({ data }) => validateOverview(data)),
        axios
          .get<DailyScan[]>(`${API}/api/admin/analytics/daily-scans`, options)
          .then(({ data }) => normalizeScans(data)),
        axios
          .get<DailySignup[]>(
            `${API}/api/admin/analytics/daily-conversion`,
            options
          )
          .then(({ data }) => normalizeSignups(data)),
        axios
          .get<Device[]>(`${API}/api/admin/analytics/devices`, options)
          .then(({ data }) => normalizeDevices(data)),
        axios
          .get<Invite[]>(`${API}/api/admin/analytics/leaderboard`, options)
          .then(({ data }) => validateLeaderboard(data)),
      ]);

      if (controller.signal.aborted) return;

      const [overview, scans, signups, devices, leaderboard] = results;

      let signupMessage = "";

      if (signups.status === "rejected") {
        signupMessage =
          axios.isAxiosError(signups.reason) &&
          signups.reason.response?.data?.code ===
            "DAILY_SIGNUP_HISTORY_UNAVAILABLE"
            ? "Daily signup history is unavailable. The backend needs the updated signup analytics route."
            : "Daily signup data could not be loaded or contains invalid records. Try refreshing.";
      }

      setAnalytics({
        overview: overview.status === "fulfilled" ? overview.value : null,
        scans: scans.status === "fulfilled" ? scans.value : [],
        signups: signups.status === "fulfilled" ? signups.value : [],
        devices: devices.status === "fulfilled" ? devices.value : [],
        leaderboard:
          leaderboard.status === "fulfilled" ? leaderboard.value : [],
        errors: {
          overview:
            overview.status === "rejected"
              ? "Overview metrics could not be loaded."
              : undefined,
          scans:
            scans.status === "rejected"
              ? "Daily scan data could not be loaded or contains invalid records."
              : undefined,
          devices:
            devices.status === "rejected"
              ? "Device data could not be loaded."
              : undefined,
          leaderboard:
            leaderboard.status === "rejected"
              ? "Invite rankings could not be loaded."
              : undefined,
        },
        signupMessage,
      });

      setLoading(false);
    }

    void loadAnalytics();

    return () => controller.abort();
  }, [reload]);

  const chartData = useMemo(() => {
    // Calculate the average before filtering so the first visible
    // day can include the preceding six days.
    const withAverage = analytics.scans.map((point, index, points) => {
      const window = points.slice(Math.max(0, index - 6), index + 1);
      const average =
        window.length === 7
          ? Number(
              (window.reduce((sum, day) => sum + day.scans, 0) / 7).toFixed(2)
            )
          : null;

      return { ...point, average };
    });

    if (range === "all") return withAverage;

    const start = dateTimestamp(utcToday()) - (Number(range) - 1) * DAY_MS;

    return withAverage.filter((point) => dateTimestamp(point.date) >= start);
  }, [analytics.scans, range]);

  const signupChartData = useMemo(() => {
    if (range === "all") return analytics.signups;
    const start = dateTimestamp(utcToday()) - (Number(range) - 1) * DAY_MS;
    return analytics.signups.filter(
      (point) => dateTimestamp(point.date) >= start
    );
  }, [analytics.signups, range]);

  const periodSignups = signupChartData.reduce(
    (sum, day) => sum + day.signups,
    0
  );

  const periodScans = chartData.reduce((sum, day) => sum + day.scans, 0);
  const recordedScans = analytics.scans.reduce(
    (sum, day) => sum + day.scans,
    0
  );
  const deviceTotal = analytics.devices.reduce(
    (sum, device) => sum + device._count.device,
    0
  );

  const overview = analytics.overview;
  const today = utcToday();

  const deviceChart = analytics.devices.map((row) => ({
    device: row.device || "unknown",
    scans: row._count.device,
    percentage:
      deviceTotal > 0
        ? Number(((row._count.device / deviceTotal) * 100).toFixed(1))
        : 0,
  }));

  if (loading) {
    return (
      <div className="p-6 text-gray-300" role="status">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Invite analytics</h1>
          <p className="mt-2 text-sm text-gray-400">
            All-time totals. Daily charts use UTC calendar dates.
          </p>
          {overview?.asOf && (
            <p className="mt-1 text-xs text-gray-400">
              Overview as of {overview.asOf}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setReload((value) => value + 1)}
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
        >
          Refresh
        </button>
      </div>

      {analytics.errors.overview ? (
        <Notice error>{analytics.errors.overview}</Notice>
      ) : overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Recorded scans" value={numberFormat.format(overview.totalScans)} />
            <Metric label="Invite signups" value={numberFormat.format(overview.totalSignups)} />
            <Metric label="Signups per scan" value={`${overview.conversionRate.toFixed(2)}%`} />
            <Metric label="Premium invite signups" value={numberFormat.format(overview.premiumSignups)} />
            <Metric
              label="Estimated revenue"
              value={currencyFormat.format(
                overview.estimatedRevenue ?? overview.revenue
              )}
            />
          </div>

          <p className="text-sm leading-relaxed text-gray-400">
            Scan counts may include repeat visits. Signups use stored invite
            counters. Estimated revenue assumes $29 per premium invite signup;
            it does not verify payments or refunds.
          </p>
        </>
      ) : null}

      {overview &&
        !analytics.errors.scans &&
        overview.totalScans !== recordedScans && (
          <Notice>
            The overview reports {numberFormat.format(overview.totalScans)} scans,
            while the daily records total {numberFormat.format(recordedScans)}.
            Refresh to check for activity between requests. A persistent
            difference needs investigation.
          </Notice>
        )}

      <Section
        title="Scans per day"
        description="Bars show daily recorded scans. The line shows the trailing 7-day average."
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold text-gold">
              {numberFormat.format(periodScans)}
            </div>
            <div className="text-sm text-gray-400">
              Scans in displayed period
            </div>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Scan date range">
            {([
              ["7", "7 days"],
              ["30", "30 days"],
              ["90", "90 days"],
              ["all", "All time"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={range === value}
                onClick={() => setRange(value)}
                className={`rounded-lg border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 ${
                  range === value
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                    : "border-gray-700 text-gray-300 hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {analytics.errors.scans ? (
          <Notice error>{analytics.errors.scans}</Notice>
        ) : chartData.length === 0 ? (
          <Notice>No recorded scans in this period.</Notice>
        ) : (
          <>
            <div
              role="img"
              aria-label={`Daily scan chart showing ${numberFormat.format(periodScans)} scans in the selected period`}
            >
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid vertical={false} stroke="#303030" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatTick}
                    minTickGap={36}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    labelFormatter={(label) =>
                      `${formatTick(label)}${label === today ? " · Today, partial" : ""}`
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="scans"
                    name="Daily scans"
                    fill="#D4AF37"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                  <Line
                    type="linear"
                    dataKey="average"
                    name="7-day average"
                    stroke="#5EEAD4"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Today is incomplete. Dates without records are shown as zero;
              tracking outages cannot be distinguished from no activity.
              The average starts after seven recorded calendar days.
            </p>

            <details className="mt-5">
              <summary className="cursor-pointer text-sm text-gray-300">
                View daily counts
              </summary>
              <div className="mt-3 max-h-72 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th scope="col" className="py-2">Date (UTC)</th>
                      <th scope="col" className="py-2 text-right">Scans</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...chartData].reverse().map((row) => (
                      <tr key={row.date} className="border-b border-gray-800">
                        <td className="py-2">
                          {row.date}{row.date === today ? " (partial)" : ""}
                        </td>
                        <td className="py-2 text-right">
                          {numberFormat.format(row.scans)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </Section>

      <Section
        title="Daily invite signups"
        description="Existing accounts with a saved invite code, grouped by account creation date in UTC. Uses the same date range selected above."
      >
        {analytics.signupMessage ? (
          <Notice error>{analytics.signupMessage}</Notice>
        ) : signupChartData.length === 0 ? (
          <Notice>No recorded invite signups in this period.</Notice>
        ) : (
          <>
            <div className="mb-5">
              <div className="text-2xl font-semibold text-gold">
                {numberFormat.format(periodSignups)}
              </div>
              <div className="text-sm text-gray-400">
                Invite signups in displayed period
              </div>
            </div>
            <div
              role="img"
              aria-label={`Daily invite signup chart showing ${numberFormat.format(periodSignups)} signups in the selected period`}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={signupChartData}
                  margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} stroke="#303030" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatTick}
                    minTickGap={36}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: "#fff" }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    labelFormatter={(label) =>
                      `${formatTick(label)}${label === today ? " · Today, partial" : ""}`
                    }
                  />
                  <Bar
                    dataKey="signups"
                    name="Invite signups"
                    fill="#5EEAD4"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Today is incomplete. Deleted accounts and accounts without a saved
              invite code are excluded, so totals may differ from invite counters.
            </p>
            <details className="mt-5">
              <summary className="cursor-pointer text-sm text-gray-300">
                View daily signup counts
              </summary>
              <div className="mt-3 max-h-72 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th scope="col" className="py-2">Date (UTC)</th>
                      <th scope="col" className="py-2 text-right">Signups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...signupChartData].reverse().map((row) => (
                      <tr key={row.date} className="border-b border-gray-800">
                        <td className="py-2">
                          {row.date}{row.date === today ? " (partial)" : ""}
                        </td>
                        <td className="py-2 text-right">
                          {numberFormat.format(row.signups)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </Section>

      <Section
        title="Device breakdown"
        description="All-time recorded scans by reported device type."
      >
        {analytics.errors.devices ? (
          <Notice error>{analytics.errors.devices}</Notice>
        ) : deviceTotal === 0 ? (
          <Notice>No device scan records available.</Notice>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={deviceChart}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
              >
                <CartesianGrid horizontal={false} stroke="#303030" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="device"
                  width={85}
                  tick={{ fill: "#d4d4d4", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#fff" }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="scans"
                  name="Recorded scans"
                  fill="#D4AF37"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
              {deviceChart.map((device) => (
                <span key={device.device}>
                  {device.device}: {numberFormat.format(device.scans)}
                  {" "}({device.percentage}%)
                </span>
              ))}
            </div>
          </>
        )}
      </Section>

      <Section
        title="Top invites by signups"
        description="Ranked using stored invite counters. These scan counters may differ from recorded scan events."
      >
        {analytics.errors.leaderboard ? (
          <Notice error>{analytics.errors.leaderboard}</Notice>
        ) : analytics.leaderboard.length === 0 ? (
          <Notice>No invites available.</Notice>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th scope="col" className="py-3 pr-4">Rank</th>
                  <th scope="col" className="py-3 pr-4">Invite code</th>
                  <th scope="col" className="px-4 py-3 text-right">Scans</th>
                  <th scope="col" className="py-3 text-right">Signups</th>
                </tr>
              </thead>
              <tbody>
                {analytics.leaderboard.map((invite, index) => (
                  <tr key={invite.code} className="border-b border-gray-800">
                    <td className="py-4 pr-4 text-gray-400">{index + 1}</td>
                    <td className="py-4 pr-4">
                      <span className="break-all font-mono text-gold">
                        {invite.code}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      {numberFormat.format(invite.scanCount)}
                    </td>
                    <td className="whitespace-nowrap py-4 text-right">
                      {numberFormat.format(invite.signupCount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-lynq-gray-2 bg-lynq-dark-2 p-5">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gold">{value}</div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold text-gold">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        )}
      </div>
      <div className="rounded-2xl border border-lynq-gray-2 bg-lynq-dark p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      role={error ? "alert" : undefined}
      className={`rounded-xl border p-4 text-sm leading-relaxed ${
        error
          ? "border-red-500/30 bg-red-500/10 text-red-200"
          : "border-gray-700 bg-white/5 text-gray-300"
      }`}
    >
      {children}
    </div>
  );
}
