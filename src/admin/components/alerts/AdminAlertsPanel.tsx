import { useEffect, useState } from "react";

interface AdminAlert {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: number;
}

export default function AdminAlertsPanel() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/admin-alerts");

    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data) as AdminAlert;

      setAlerts((prev) => [
        {
          ...alert,
          timestamp: alert.timestamp || Date.now(),
        },
        ...prev,
      ]);
    };

    return () => ws.close();
  }, []);

  const getColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-700 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 h-80 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Admin Alerts</h2>

      <div className="overflow-y-auto space-y-3 pr-2">
        {alerts.length === 0 && (
          <p className="text-gray-500 text-sm">No alerts yet</p>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded p-3 ${getColor(alert.severity)}`}
          >
            <p className="font-semibold capitalize">{alert.severity}</p>
            <p className="text-sm mt-1">{alert.message}</p>
            <p className="text-xs mt-2 opacity-70">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
