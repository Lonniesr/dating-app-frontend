import { useState } from "react";
import { adminReportsService } from "../services/adminReportsService";
import type { ReportRow } from "../services/adminReportsService";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("users");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preview, setPreview] = useState<ReportRow[]>([]);
  const [csv, setCsv] = useState("");

  const generateReport = async () => {
    const res = await adminReportsService.fetchReport(
      reportType,
      startDate || undefined,
      endDate || undefined
    );

    setPreview(res.rows);
    setCsv(adminReportsService.generateCSV(res.rows));
  };

  return (
    <div className="fade-in">
      <h1 className="admin-gold-shimmer" style={{ marginBottom: "2rem" }}>
        Reports
      </h1>

      {/* FILTERS */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h2 className="h2">Generate Report</h2>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <select
            className="select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="users">Users</option>
            <option value="matches">Matches</option>
            <option value="messages">Messages</option>
            <option value="verification">Verification</option>
          </select>

          <input
            className="input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            className="input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button className="btn-gold" onClick={generateReport}>
            Generate
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      {preview.length > 0 && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2 className="h2">Preview</h2>

          <table className="table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                {Object.keys(preview[0]).map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((h) => (
                    <td key={h}>{String(row[h] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn-gold"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${reportType}-report.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}
