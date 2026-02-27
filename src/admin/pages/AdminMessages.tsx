import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

import { adminMessagesService } from "../services/adminMessagesService";
import type { Message } from "../services/adminMessagesService";

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();

  const [conversation, setConversation] = useState<Message[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["admin-messages"],
    queryFn: () => adminMessagesService.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminMessagesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const openConversation = async (userA: string, userB: string) => {
    const convo = await adminMessagesService.getConversation(userA, userB);
    setConversation(convo);
    setModalOpen(true);
  };

  if (isLoading) {
    return <div className="glass-card">Loading messages…</div>;
  }

  return (
    <div className="fade-in">
      <h1
        className="admin-gold-shimmer"
        style={{ fontSize: "2rem", marginBottom: "1.5rem" }}
      >
        Message Moderation
      </h1>

      <DataTable
        searchable
        columns={[
          { key: "sender", label: "Sender" },
          { key: "receiver", label: "Receiver" },
          { key: "content", label: "Message" },
          { key: "createdAt", label: "Sent At" },
        ]}
        data={
          messages?.map((m) => ({
            id: m.id,
            sender: `${m.sender.name ?? "Unknown"} (${m.sender.email})`,
            receiver: `${m.receiver.name ?? "Unknown"} (${m.receiver.email})`,
            content: m.content,
            createdAt: new Date(m.createdAt).toLocaleString(),
            senderId: m.sender.id,
            receiverId: m.receiver.id,
          })) ?? []
        }
        actions={[
          {
            label: "View Conversation",
            className: "btn-gold",
            onClick: (row) => openConversation(row.senderId, row.receiverId),
          },
          {
            label: "Delete",
            className: "btn-danger",
            onClick: (row) => deleteMutation.mutate(row.id),
          },
        ]}
      />

      {/* Conversation Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="glass-panel modal">
            <h2 className="h2">Conversation</h2>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                marginTop: "1rem",
                paddingRight: "1rem",
              }}
            >
              {conversation?.map((msg) => (
                <div
                  key={msg.id}
                  className="glass-card"
                  style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    borderLeft: "4px solid var(--lynq-gold)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {msg.sender.name ?? "Unknown"} →{" "}
                    {msg.receiver.name ?? "Unknown"}
                  </div>

                  <div style={{ marginBottom: "0.5rem" }}>{msg.content}</div>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--lynq-text-muted)",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}

              {conversation?.length === 0 && (
                <div className="glass-card" style={{ padding: "1rem" }}>
                  No messages found between these users.
                </div>
              )}
            </div>

            <button
              className="btn-gold"
              style={{ marginTop: "1rem" }}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
