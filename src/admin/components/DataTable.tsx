import { useState, useMemo } from "react";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
}

export interface DataTableAction<T> {
  label: string;
  className?: string;
  onClick: (row: T) => void;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: DataTableAction<T>[];
  searchable?: boolean;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  actions,
  searchable = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filter
  const filtered = useMemo(() => {
    if (!search) return data;

    const lower = search.toLowerCase();

    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [search, data]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];

      if (x == null || y == null) return 0;

      if (x < y) return sortDir === "asc" ? -1 : 1;
      if (x > y) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="glass-panel fade-in">
      {/* Search */}
      {searchable && (
        <input
          className="input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
      )}

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => toggleSort(col.key)}
                style={{ cursor: "pointer" }}
              >
                {col.label}
                {sortKey === col.key && (
                  <span style={{ marginLeft: "6px", color: "var(--lynq-gold)" }}>
                    {sortDir === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}

            {actions && <th style={{ width: "120px" }}>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                cursor: onRowClick ? "pointer" : "default",
              }}
            >
              {columns.map((col) => (
                <td key={String(col.key)}>{row[col.key]}</td>
              ))}

              {actions && (
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        className={action.className || "btn-outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--lynq-text-muted)",
                }}
              >
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
