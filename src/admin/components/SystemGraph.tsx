
import { motion } from "framer-motion";

interface SystemNode {
  id: string;
  label: string;
  type: string;
  cpu: number;
  memory: number;
  status: "HEALTHY" | "WARN" | "ERROR";
}

interface SystemEdge {
  from: string;
  to: string;
  traffic: number;
  latency: number;
}

interface SystemGraphProps {
  nodes: SystemNode[];
  edges: SystemEdge[];
}

export default function SystemGraph({ nodes, edges }: SystemGraphProps) {
  // simple circular layout
  const radius = 140;
  const centerX = 200;
  const centerY = 180;

  const positionedNodes = nodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / Math.max(nodes.length, 1);
    return {
      ...n,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const getNodeColor = (status: SystemNode["status"]) => {
    if (status === "ERROR") return "shadow-[0_0_25px_rgba(255,0,0,0.6)] border-red-500";
    if (status === "WARN") return "shadow-[0_0_25px_rgba(255,200,0,0.5)] border-amber-400";
    return "shadow-[0_0_25px_rgba(212,175,55,0.5)] border-[#d4af37]/60";
  };

  return (
    <div className="relative w-full h-[360px] bg-black/30 backdrop-blur-xl rounded-2xl border border-[#1a1a1a] overflow-hidden p-4">
      {/* edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((e, i) => {
          const from = positionedNodes.find((n) => n.id === e.from);
          const to = positionedNodes.find((n) => n.id === e.to);
          if (!from || !to) return null;

          const trafficNorm = Math.min(e.traffic / 100, 1);
          const strokeWidth = 1 + trafficNorm * 3;

          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#d4af37"
              strokeWidth={strokeWidth}
              strokeOpacity={0.4 + trafficNorm * 0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          );
        })}
      </svg>

      {/* nodes */}
      {positionedNodes.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2
            rounded-full px-4 py-2
            bg-black/70 backdrop-blur-xl
            border ${getNodeColor(n.status)}
            text-xs text-gray-200
            flex flex-col items-center
          `}
          style={{ left: n.x, top: n.y }}
        >
          <span className="text-[#d4af37] font-semibold">{n.label}</span>
          <span className="text-[10px] text-gray-400">
            CPU {n.cpu}% • MEM {n.memory}%
          </span>
        </motion.div>
      ))}
    </div>
  );
}