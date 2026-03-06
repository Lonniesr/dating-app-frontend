import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConversations } from "./hooks/useConversations";
import type { ConversationPreview } from "./hooks/useConversations";
import { motion } from "framer-motion";
import { getPhotoThumbnail } from "../utils/getPhotoThumbnail";

function formatRelativeTime(date?: string) {
  if (!date) return "";

  const now = Date.now();
  const diff = Math.floor((now - new Date(date).getTime()) / 1000);

  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

  return new Date(date).toLocaleDateString();
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversations();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!conversations) return [];

    return conversations.filter((c: ConversationPreview) =>
      c.user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [conversations, search]);

  return (
    <div className="flex flex-col h-full text-white">

      {/* HEADER */}

      <div className="p-6 pb-3 sticky top-0 bg-black/60 backdrop-blur-xl z-10 border-b border-white/10">

        <h1 className="text-3xl font-bold">Messages</h1>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

      </div>

      {/* CONVERSATION LIST */}

      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-4">

        {/* LOADING STATE */}

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="w-14 h-14 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}

        {/* EMPTY STATE */}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center mt-10">

            <p className="text-white/60 mb-4">
              No conversations yet.
            </p>

            <button
              onClick={() => navigate("/user/discover")}
              className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              Start Matching
            </button>

          </div>
        )}

        {/* CONVERSATIONS */}

        {!isLoading &&
          filtered.map((c: ConversationPreview, index: number) => {
            const last = c.lastMessage;
            const unread = c.unreadCount > 0;

            const avatar =
              c.user.avatar
                ? getPhotoThumbnail(c.user.avatar)
                : "/placeholder.jpg";

            return (
              <motion.div
                key={c.conversationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >

                <Link
                  to={`${c.user.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition relative"
                >

                  {/* AVATAR */}

                  <div className="relative">

                    <img
                      src={avatar}
                      className="w-14 h-14 rounded-full object-cover border border-white/20"
                    />

                    <span
                      className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border border-black ${
                        c.user.online
                          ? "bg-green-400"
                          : "bg-gray-500"
                      }`}
                    />

                  </div>

                  {/* MESSAGE INFO */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between">

                      <p className="font-semibold text-lg truncate">
                        {c.user.name}
                      </p>

                      <p className="text-xs text-white/40">
                        {formatRelativeTime(last?.createdAt)}
                      </p>

                    </div>

                    <p className="text-white/60 text-sm truncate max-w-[250px]">
                      {last?.text || "Sent a message"}
                    </p>

                  </div>

                  {/* UNREAD BADGE */}

                  {unread && (
                    <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-sm font-semibold">
                      {c.unreadCount}
                    </span>
                  )}

                  {/* QUICK CHAT BUTTON */}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/user/messages/${c.user.id}`);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-xs bg-yellow-500 text-black px-3 py-1 rounded-lg absolute right-4"
                  >
                    Open
                  </button>

                </Link>

              </motion.div>
            );
          })}

      </div>

    </div>
  );
}