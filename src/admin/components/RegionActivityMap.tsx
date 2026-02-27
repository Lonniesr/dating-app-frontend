
import { motion } from "framer-motion";

interface RegionActivity {
  region: string;
  activeUsers: number;
  signups: number;
  matches: number;
  messages: number;
}

interface RegionActivityMapProps {
  regions: RegionActivity[];
}

export default function RegionActivityMap({ regions }: RegionActivityMapProps) {
  // simple horizontal bar heatmap by region
  const maxUsers = Math.max(...regions.map((r) => r.activeUsers), 1);

  return (
    <div className="w-full h-[360px] bg-black/30 backdrop-blur-xl rounded-2xl border border-[#1a1a1a] p-4 flex flex-col">
      <h3 className="text-[#d4af37] text-sm font-semibold mb-3">
        Regional Activity
      </h3>

      <div className="space-y-2 overflow-y-auto pr-2">
        {regions.map((r, i) => {
          const ratio = r.activeUsers / maxUsers;
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{r.region}</span>
                <span>{r.activeUsers} active</span>
              </div>
              <div className="w-full h-2 bg-[#111] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(ratio * 100, 5)}%` }}
                  className="h-full bg-gradient-to-r from-[#d4af37] via-amber-400 to-red-500"
                />
              </div>
              <div className="flex gap-3 text-[10px] text-gray-500">
                <span>Signups: {r.signups}</span>
                <span>Matches: {r.matches}</span>
                <span>Messages: {r.messages}</span>
              </div>
            </div>
          );
        })}

        {regions.length === 0 && (
          <p className="text-gray-500 text-xs mt-4">
            No regional activity data available.
          </p>
        )}
      </div>
    </div>
  );
}