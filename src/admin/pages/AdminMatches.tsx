import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

import { adminMatchesService } from "../services/adminMatchesService";
import type { Match } from "../services/adminMatchesService";

export default function AdminMatchesPage() {
  const queryClient = useQueryClient();

  const { data: matches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["admin-matches"],
    queryFn: () => adminMatchesService.list(), // ✅ returns Match[]
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminMatchesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] }),
  });

  if (isLoading) {
    return <div className="glass-card">Loading matches…</div>;
  }

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Matches
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "userA" as any, label: "User A" },
          { key: "userB" as any, label: "User B" },
          { key: "createdAt" as any, label: "Matched On" },
        ]}
        data={matches.map((m: Match) => ({
          id: m.id,
          userA: `${m.userA?.name ?? "Unknown"} (${m.userA?.email ?? ""})`,
          userB: `${m.userB?.name ?? "Unknown"} (${m.userB?.email ?? ""})`,
          createdAt: new Date(m.createdAt).toLocaleString(),
        }))}
        actions={[
          {
            label: "Unmatch",
            className: "btn-danger",
            onClick: (row: any) => deleteMutation.mutate(row.id),
          },
        ]}
      />
    </div>
  );
}