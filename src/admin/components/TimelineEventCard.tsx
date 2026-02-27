interface TimelineEventCardProps {
  type: string;
  message: string;
  timestamp: string;
  icon: JSX.Element;
  color: string;
}

export default function TimelineEventCard({
  type,
  message,
  timestamp,
  icon,
  color,
}: TimelineEventCardProps) {
  return (
    <div
      className={`border ${color} rounded-xl p-4 bg-[#0b0b0b] shadow-lg shadow-black/40 mb-3 flex gap-3`}
    >
      <div className="text-xl text-[#d4af37] flex items-start">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
          {type}
        </div>
        <div className="text-sm text-white">{message}</div>
        <div className="text-[10px] text-gray-500 mt-1">
          {new Date(timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}