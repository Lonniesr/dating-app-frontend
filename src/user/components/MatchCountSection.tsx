import { useMatchCount } from "../hooks/useMatchCount";

export default function MatchCountSection() {
  const { data, isLoading } = useMatchCount();

  if (isLoading) {
    return (
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white/60">
        Loading match count…
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-white mb-6">
      <h2 className="text-xl font-bold mb-2">Matches</h2>
      <p className="text-4xl font-bold">{data.count}</p>
    </div>
  );
}
