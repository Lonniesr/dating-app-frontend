interface AlertCardGlassProps {
  title: string;
  message: string;
  severity: "CRITICAL" | "SECURITY" | "WARNING" | "INFO";
  timestamp: string;
}

export default function AlertCardGlass({
  title,
  message,
  severity,
  timestamp,
}: AlertCardGlassProps) {
  const color =
    severity === "CRITICAL"
      ? "border-red-500"
      : severity === "SECURITY"
      ? "border-red-400"
      : severity === "WARNING"
      ? "border-amber-400"
      : "border-[#d4af37]/40";

  return (
    <div
      className={`bg-[#0f0f0f] border ${color} rounded-xl p-4 shadow-lg shadow-black/40 mb-3`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">{message}</p>
        </div>
        <span className="text-[10px] text-gray-500 whitespace-nowrap">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
      <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
        {severity}
      </div>
    </div>
  );
}