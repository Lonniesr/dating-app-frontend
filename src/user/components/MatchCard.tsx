type MatchCardProps = {
  match: {
    id: string;
    name: string;
    gender?: string;
    photos?: string[];
  };
};

export default function MatchCard({ match }: MatchCardProps) {
  const primaryPhoto =
    match.photos && match.photos.length > 0
      ? match.photos[0]
      : "/placeholder.jpg";

  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition">
      <img
        src={primaryPhoto}
        alt={match.name}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div>
        <p className="font-bold text-lg">{match.name}</p>
        <p className="text-white/60 text-sm">
          {match.gender || "—"}
        </p>
      </div>

      <div className="ml-auto">
        <a
          href={`/chat/${match.id}`}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold"
        >
          Chat
        </a>
      </div>
    </div>
  );
}