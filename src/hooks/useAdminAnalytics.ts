import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
};

export function useAdminAnalytics() {
  const { data, error, isLoading } = useSWR("/admin/analytics", fetcher, {
    refreshInterval: 5000, // auto-refresh every 5s
  });

  return {
    analytics: data,
    loading: isLoading,
    error,
  };
}