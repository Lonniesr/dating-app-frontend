import axios from "axios";

const BASE = "/api/admin/reports";

export interface ReportRow {
  [key: string]: any;
}

export interface ReportResponse {
  success: boolean;
  type: string;
  start: string | null;
  end: string | null;
  rows: ReportRow[];
}

export const adminReportsService = {
  async fetchReport(type: string, start?: string, end?: string): Promise<ReportResponse> {
    const res = await axios.get(BASE, {
      params: { type, start, end },
    });
    return res.data as ReportResponse;
  },

  generateCSV(rows: ReportRow[]): string {
    if (!rows.length) return "";

    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            if (val === null || val === undefined) return "";
            return String(val).replace(/,/g, " ");
          })
          .join(",")
      ),
    ];

    return csvRows.join("\n");
  },
};
