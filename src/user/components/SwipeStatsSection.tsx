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

  const total = (data.likesGiven ?? 0) + (data.passesGiven ?? 0);

  return (

    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white mb-6">

      <h2 className="text-xl font-bold mb-3">
        Swipe Stats
      </h2>

      <div className="space-y-1 text-white/80">

        <p>
          <strong>Total Swipes:</strong> {total}
        </p>

        <p>
          <strong>Likes Given:</strong> {data.likesGiven ?? 0}
        </p>

        <p>
          <strong>Passes:</strong> {data.passesGiven ?? 0}
        </p>

        <p>
          <strong>Super Likes:</strong> {data.superLikesGiven ?? 0}
        </p>

        <p>
          <strong>Likes Received:</strong> {data.likesReceived ?? 0}
        </p>

        <p>
          <strong>Matches:</strong> {data.matches ?? 0}
        </p>

      </div>

    </div>

  );
}