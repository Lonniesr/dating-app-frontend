import { useEffect, useState } from "react";

interface TimelineEvent {
  id: string;
  type: "info" | "system" | "match" | "moderation" | "warning" | "error";
  message: string;
  timestamp: number;
}

export default function AdminTimelineFeed() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/admin-timeline");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as TimelineEvent;

      setEvents((prev) => [
        {
          ...data,
          timestamp: data.timestamp || Date.now(),
        },
        ...prev,
      ]);
    };

    return () => ws.close();
  }, []);

  const getColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-300 bg-red-100 text-red-700";
      case "warning":
        return "border-yellow-300 bg-yellow-100 text-yellow-700";
      case "match":
        return "border-green-300 bg-green-100 text-green-700";
      case "moderation":
        return "border-purple-300 bg-purple-100 text-purple-700";
      case "system":
        return "border-blue-300 bg-blue-100 text-blue-700";
      default:
        return "border-gray-300 bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 h-80 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">System Timeline</h2>

      <div className="overflow-y-auto space-y-3 pr-2">
        {events.length === 0 && (
          <p className="text-gray-500 text-sm">No timeline events yet</p>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className={`border rounded p-3 ${getColor(event.type)}`}
          >
            <p className="font-semibold capitalize">{event.type}</p>
            <p className="text-sm mt-1">{event.message}</p>
            <p className="text-xs mt-2 opacity-70">
              {new Date(event.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
