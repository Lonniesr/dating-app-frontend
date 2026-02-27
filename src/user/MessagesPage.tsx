import { Link } from "react-router-dom";
import { useConversations } from "./hooks/useConversations";
import type { ConversationPreview } from "./hooks/useConversations";
import { motion } from "framer-motion";

export default function MessagesPage() {
  const { data: conversations, isLoading } = useConversations();

  return (
    <div className="flex flex-col h-full text-white">
      <div className="p-6 pb-3 sticky top-0 bg-black/60 backdrop-blur-xl z-10">
        <h1 className="text-3xl font-bold">Messages</h1>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-4">
        {isLoading && (
          <p className="text-white/60">Loading conversations...</p>
        )}

        {!isLoading && conversations?.length === 0 && (
          <p className="text-white/60">No conversations yet.</p>
        )}

        {!isLoading &&
          conversations?.map((c: ConversationPreview, index: number) => {
            const last = c.lastMessage;
            const unread = c.unreadCount > 0;

            return (
              <motion.div
                key={c.conversationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* ✅ RELATIVE LINK */}
                <Link
                  to={`${c.user.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition group"
                >
                  <div className="relative">
                    <img
                      src={c.user.avatar || "/placeholder.jpg"}
                      className="w-14 h-14 rounded-full object-cover border border-white/20"
                    />

                    <span
                      className={`absolute -right-1 -bottom-1 w-4 h-4 rounded-full border border-black ${
                        c.user.online ? "bg-green-400" : "bg-gray-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg truncate">
                        {c.user.name}
                      </p>

                      <p className="text-xs text-white/40">
                        {last?.createdAt
                          ? new Date(last.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>

                    <p className="text-white/60 text-sm truncate max-w-[250px]">
                      {last?.text || "Sent a message"}
                    </p>
                  </div>

                  {unread && (
                    <span className="px-3 py-1 rounded-full bg-yellow-400 text-black text-sm font-semibold">
                      {c.unreadCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}