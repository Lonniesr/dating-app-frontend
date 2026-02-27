// src/lib/analytics.ts

// ---------- Shared helper ----------

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    // You can add credentials / headers here if needed
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---------- Types ----------

export type AnalyticsOverview = {
  totalUsers: number;
  activeUsers: number;
  invitesSent: number;
  invitesUsed: number;
  conversionRate: number;
};

export type AnalyticsWeeklyPoint = {
  day: string; // e.g. "2026-01-14"
  count: number;
};

export type AnalyticsCharts = {
  weeklyInvites: AnalyticsWeeklyPoint[];
  activeUsers: AnalyticsWeeklyPoint[];
};

export type AnalyticsEvent = {
  id: string;
  type: string;
  createdAt: string;
  [key: string]: any;
};

export type AnalyticsSystemHealth = {
  cpu: number;
  uptime: number;
  latency: number;
  db: string;
  api: string;
};

export type AnalyticsVelocity = {
  velocity: number; // percentage index vs prior period
};

export type AnalyticsHeatmapRow = {
  hour: number; // 0-23
  day: number; // 0-6 (depending on DB: 0=Mon or 0=Sun)
  count: number;
};

export type AnalyticsCohortRow = {
  cohort: number | string; // YEARWEEK or similar
  period: number; // week index
  users: number;
};

export type AnalyticsFunnel = {
  landing: number;
  signup: number;
  profile: number;
  match: number;
  message: number;
  retained: number;
};

export type AnalyticsJourneyRow = {
  fromStep: string;
  toStep: string;
  count: number;
};

// ---------- API helpers ----------

// Overview: metric cards
export async function getAnalyticsOverview() {
  return fetchJson<AnalyticsOverview>("/api/admin/analytics/overview");
}

// Charts: line + bar datasets
export async function getAnalyticsCharts() {
  return fetchJson<AnalyticsCharts>("/api/admin/analytics/charts");
}

// Activity feed: latest events
export async function getAnalyticsActivity() {
  return fetchJson<AnalyticsEvent[]>("/api/admin/analytics/activity");
}

// System health: CPU, latency, db/api status
export async function getAnalyticsSystemHealth() {
  return fetchJson<AnalyticsSystemHealth>("/api/admin/analytics/system");
}

// Growth velocity gauge
export async function getAnalyticsVelocity() {
  return fetchJson<AnalyticsVelocity>("/api/admin/analytics/velocity");
}

// Daily activity heatmap
export async function getAnalyticsHeatmap() {
  return fetchJson<AnalyticsHeatmapRow[]>("/api/admin/analytics/heatmap");
}

// Cohort retention heatmap
export async function getAnalyticsCohorts() {
  return fetchJson<AnalyticsCohortRow[]>("/api/admin/analytics/cohorts");
}

// Funnel conversion chart
export async function getAnalyticsFunnel() {
  return fetchJson<AnalyticsFunnel>("/api/admin/analytics/funnel");
}

// User journey flow map
export async function getAnalyticsJourney() {
  return fetchJson<AnalyticsJourneyRow[]>("/api/admin/analytics/journey");
}