import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  messagesService,
  ConversationPreview,
} from "./services/messageService";

export default function MessagePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [requestCount, setRequestCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<
    ConversationPreview[]
  >([]);

  async function loadConversations() {
    try {
      const data = await messagesService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadRequestCount() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/photo-access/incoming`,
        {
          withCredentials: true,
        }
      );

      setRequestCount(res.data?.length || 0);
    } catch (err) {
      console.error("Failed to load request count", err);
    }
  }

  useEffect(() => {
    loadConversations();
    loadRequestCount();

    const interval = setInterval(() => {
      loadConversations();
      loadRequestCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredConversations = conversations.filter((c) =>
    (c.user?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox</h1>

        <button
          onClick={() => navigate("/user/requests")}
          className="bg-pink-500 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          Requests

          {requestCount > 0 && (
            <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {requestCount}
            </span>
          )}
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search conversations..."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
      />

      {/* EMPTY */}
      {filteredConversations.length === 0 && (
        <div className="text-center text-white/50 py-16">
          No conversations yet
        </div>
      )}

      {/* CONVERSATIONS */}
      <div className="space-y-3">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.conversationId}
            onClick={() =>
              navigate(`/user/messages/${conversation.user.id}`)
            }
            className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            {/* AVATAR */}
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
              <img
                src={
                  conversation.user.avatar ||
                  "/default-avatar.png"
                }
                alt={conversation.user.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">
                {conversation.user.name || "Unknown User"}
              </p>

              <p className="text-white/60 text-sm truncate">
                {conversation.lastMessage?.text ||
                  "Start chatting 👋"}
              </p>
            </div>

            {/* UNREAD */}
            {conversation.unreadCount > 0 && (
              <div className="min-w-[24px] h-6 px-2 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}