import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { adminSettingsService } from "../services/adminSettingsService";
import type { Setting } from "../services/adminSettingsService";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["admin-settings"],
    queryFn: () => adminSettingsService.list(),
  });

  const saveMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminSettingsService.save(key, value),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const [edited, setEdited] = useState<Record<string, string>>({});

  if (isLoading) {
    return <div className="glass-card">Loading settings…</div>;
  }

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        System Settings
      </h1>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "200px" }}>Key</th>
              <th>Value</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {settings?.map((setting) => {
              const currentValue =
                edited[setting.key] !== undefined
                  ? edited[setting.key]
                  : setting.value;

              return (
                <tr key={setting.key}>
                  <td>{setting.key}</td>

                  <td>
                    <input
                      className="input"
                      value={currentValue}
                      onChange={(e) =>
                        setEdited({
                          ...edited,
                          [setting.key]: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td>
                    <button
                      className="btn-gold"
                      onClick={() =>
                        saveMutation.mutate({
                          key: setting.key,
                          value: currentValue,
                        })
                      }
                      disabled={saveMutation.isPending}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}

            {settings && settings.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--lynq-text-muted)",
                  }}
                >
                  No settings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
