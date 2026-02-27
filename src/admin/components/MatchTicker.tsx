import { useEffect, useRef, useState } from "react";

interface MatchEvent {
  matchId: string;
  userA: string;
  userB: string;
  timestamp: number;
}

export default function MatchTicker() {
  const [matches, setMatches] = useState<MatchEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/admin-analytics");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "new_match") {
          const match = data.value as MatchEvent;

          setMatches((prev) => {
            const updated = [match, ...prev];
            return updated.slice(0, 20); // keep last 20
          });
        }
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-4 shadow-lg shadow-black/40">
      <h2 className="text-lg font-semibold mb-3 text-[#d4af37]">
        Live Match Ticker
      </h2>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
        {matches.map((m) => (
          <TickerItem key={m.matchId} match={m} />
        ))}

        {matches.length === 0 && (
          <p className="text-gray-500 text-sm">Waiting for matches…</p>
        )}
      </div>
    </div>
  );
}

function TickerItem({ match }: { match: MatchEvent }) {
  const time = new Date(match.timestamp).toLocaleTimeString();

  return (
    <div className="animate-slide-in flex items-center justify-between bg-black/30 border border-white/10 rounded-lg p-3">
      <div>
        <p className="text-white font-medium">
          {match.userA} <span className="text-[#d4af37]">♥</span> {match.userB}
        </p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>

      <span className="text-xs text-[#d4af37] opacity-70">
        #{match.matchId.slice(0, 6)}
      </span>
    </div>
  );
}