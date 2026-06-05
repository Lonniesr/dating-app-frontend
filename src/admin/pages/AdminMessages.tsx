import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";

import { adminMessagesService } from "../services/adminMessagesService";
import type { Message } from "../services/adminMessagesService";
const LYNQ_TEAM_ID =
  "3e6a706c-b29e-4202-b6f7-89a0e4bf9c4c";

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();

  const [conversation, setConversation] = useState<Message[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
const [replyText, setReplyText] = useState("");
const [selectedUserId, setSelectedUserId] = useState("");

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["admin-messages"],
    queryFn: () => adminMessagesService.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminMessagesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const openConversation = async (
  userA: string,
  userB: string
) => {
  const convo =
    await adminMessagesService.getConversation(
      userA,
      userB
    );

  setConversation(convo);

  const actualUserId =
    userA === LYNQ_TEAM_ID
      ? userB
      : userA;

  setSelectedUserId(actualUserId);

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
        LynQ Team Inbox
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
  messages
    ?.filter(
      (m) =>
        m.sender.id === LYNQ_TEAM_ID ||
        m.receiver.id === LYNQ_TEAM_ID
    )
    .map((m) => ({
            id: m.id,
            sender:
  m.sender.id === LYNQ_TEAM_ID
    ? "LynQ Team"
    : `${m.sender.name ?? "Unknown"} (${m.sender.email})`,

receiver:
  m.receiver.id === LYNQ_TEAM_ID
    ? "LynQ Team"
    : `${m.receiver.name ?? "Unknown"} (${m.receiver.email})`,
            content: m.text,
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

<div style={{ marginBottom: "0.5rem" }}>
  {msg.text}
</div>

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
<textarea
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  placeholder="Reply as LynQ Team..."
  className="input"
  style={{
    width: "100%",
    minHeight: "120px",
    marginTop: "1rem",
    color: "#fff",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
  }}
/>

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  }}
>
  <button
    className="btn-gold"
    onClick={async () => {
      if (!replyText.trim()) return;

      await adminMessagesService.sendToUser(
        selectedUserId,
        replyText
      );

      const refreshed =
        await adminMessagesService.getConversation(
          selectedUserId,
          LYNQ_TEAM_ID
        );

      setConversation(refreshed);
      setReplyText("");
    }}
  >
    Send Reply
  </button>
</div>

              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
