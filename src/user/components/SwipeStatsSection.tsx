import { useSwipeStats } from "../hooks/useSwipeStats";

export default function SwipeStatsSection() {
  const { data, isLoading } = useSwipeStats();

  if (isLoading) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white/60 mb-6">
        Loading swipe stats…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white/60 mb-6">
        No swipe stats available.
      </div>
    );
  }

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white mb-6">
      <h2 className="text-xl font-bold mb-3">Swipe Stats</h2>

      <div className="space-y-1 text-white/80">
        <p>
          <strong>Total Swipes:</strong> {data.total}
        </p>
        <p>
          <strong>Likes:</strong> {data.likes}
        </p>
        <p>
          <strong>Passes:</strong> {data.passes}
        </p>
      </div>
    </div>
  );
}
