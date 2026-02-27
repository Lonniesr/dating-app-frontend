import { useEffect, useState } from "react";

export default function useAdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (search) params.append("search", search);
    if (type !== "ALL") params.append("type", type);

    const token = localStorage.getItem("admin_token");

    const res = await fetch(`/admin/logs?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setLogs(data.logs || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, type]);

  // WebSocket real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000/logs");

    ws.onmessage = (event) => {
      const newLog = JSON.parse(event.data);

      newLog.__new = true;

      setLogs((prev) => [newLog, ...prev]);
    };

    return () => ws.close();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return {
    logs,
    loading,
    search,
    type,
    page,
    totalPages,
    expandedId,
    setSearch,
    setType,
    setPage,
    toggleExpand,
  };
}