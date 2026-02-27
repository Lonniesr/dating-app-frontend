export function exportLogsToCSV(logs: any[]) {
  if (!logs || logs.length === 0) return;

  const headers = [
    "id",
    "type",
    "action",
    "message",
    "adminId",
    "userId",
    "createdAt",
  ];

  // Convert logs to CSV rows
  const rows = logs.map((log) =>
    headers
      .map((h) => {
        const value = log[h] ?? "";

        // Ensure proper CSV escaping
        // Wrap in quotes if needed and escape internal quotes
        const safe = String(value).replace(/"/g, '""');
        return `"${safe}"`;
      })
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "logs.csv";
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
