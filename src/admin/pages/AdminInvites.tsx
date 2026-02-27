import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminInvitesService } from "../services/adminInvitesService";
import type { Invite } from "../services/adminInvitesService";

export default function AdminInvitesPage() {
  const queryClient = useQueryClient();

  const [newInvite, setNewInvite] = useState<Invite | null>(null);

  const { data: invites, isLoading } = useQuery<Invite[]>({
    queryKey: ["admin-invites"],
    queryFn: () => adminInvitesService.list(),
  });

  const createMutation = useMutation({
    mutationFn: () => adminInvitesService.create(),
    onSuccess: (invite) => {
      setNewInvite(invite); // <-- open modal with invite data
      queryClient.invalidateQueries({ queryKey: ["admin-invites"] });
    },
  });

  const closeModal = () => setNewInvite(null);

  const copyToClipboard = () => {
    if (newInvite?.url) {
      navigator.clipboard.writeText(newInvite.url);
    }
  };

  if (isLoading) {
    return <div className="glass-card">Loading invites…</div>;
  }

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Invites
      </h1>

      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="btn-gold"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating…" : "Generate Invite Code"}
        </button>
      </div>

      <div className="glass-panel">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Status</th>
              <th>Created</th>
              <th>Used At</th>
              <th>Used By</th>
            </tr>
          </thead>
          <tbody>
            {invites?.map((invite) => (
              <tr key={invite.id}>
                <td>{invite.code}</td>
                <td>
                  {invite.used ? (
                    <span className="badge badge-gold">Used</span>
                  ) : (
                    <span className="badge">Unused</span>
                  )}
                </td>
                <td>{new Date(invite.createdAt).toLocaleString()}</td>
                <td>
                  {invite.usedAt
                    ? new Date(invite.usedAt).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {invite.usedBy
                    ? `${invite.usedBy.name ?? "Unknown"} (${invite.usedBy.email})`
                    : "—"}
                </td>
              </tr>
            ))}

            {invites && invites.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--lynq-text-muted)",
                  }}
                >
                  No invites yet. Generate one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------------- */}
      {/* INVITE MODAL */}
      {/* ---------------------- */}
      {newInvite && (
        <div className="modal-backdrop fade-in">
          <div className="modal glass-card" style={{ padding: "2rem" }}>
            <h2 className="admin-gold-shimmer" style={{ marginBottom: "1rem" }}>
              Invite Created
            </h2>

            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Code:</strong> {newInvite.code}
            </p>

            <p style={{ marginBottom: "1rem" }}>
              <strong>Invite Link:</strong>
              <br />
              <a
                href={newInvite.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--lynq-gold)" }}
              >
                {newInvite.url}
              </a>
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button className="btn-gold" onClick={copyToClipboard}>
                Copy Link
              </button>

              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
