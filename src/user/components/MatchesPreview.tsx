import { useMatches } from "../../hooks/useMatches";

type MatchPreview = {
  id: string;
  name: string;
  photo?: string;
};

export default function MatchesPreview() {
  const { data: matches } = useMatches();

  const preview: MatchPreview[] = matches?.slice(0, 5) || [];

  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <h2 className="text-xl font-semibold mb-3">Your Matches</h2>

      {preview.length === 0 ? (
        <p className="text-white/60 text-sm">No matches yet.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto">
          {preview.map((m) => (
            <div
              key={m.id}
              className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-white/10 flex-shrink-0"
            >
              <img
                src={m.photo || "/placeholder.jpg"}
                alt={m.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
