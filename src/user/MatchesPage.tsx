import { useMatches } from "../hooks/useMatches";

interface MatchItem {
  id: string;
  name: string;
  gender?: string;
  photos?: string[];
  age?: number;
}

export default function MatchesPage() {
  const { data, isLoading } = useMatches();

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <p className="text-white/60">Loading matches…</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-white">
        <p className="text-white/60">You have no matches yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Matches</h1>

      {data.map((match: MatchItem) => {
        const primaryPhoto =
          match.photos && match.photos.length > 0
            ? match.photos[0]
            : "/placeholder.jpg";

        return (
          <div
            key={match.id}
            className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
              <img
                src={primaryPhoto}
                alt={match.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {match.name}
                {match.age ? `, ${match.age}` : ""}
              </p>
              <p className="text-white/60 text-sm">
                {match.gender || "—"}
              </p>
            </div>

            {/* Online indicator (placeholder for now) */}
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
        );
      })}
    </div>
  );
}