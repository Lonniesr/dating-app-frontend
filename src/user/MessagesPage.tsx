import { useNavigate } from "react-router-dom";
import { useConversations } from "./hooks/useConversations";
import { getProfilePhoto } from "../utils/getProfilePhoto";

export default function MessagesPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useConversations();

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading conversations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Failed to load conversations
      </div>
    );
  }

  const conversations = data ?? [];

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-white">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {conversations.map((c) => {
        const photo =
          getProfilePhoto(c.user.avatar ? [c.user.avatar] : []) ||
          "/placeholder.jpg";

        return (
          <div
            key={c.conversationId}
            onClick={() => navigate(`/user/messages/${c.conversationId}`)}
            className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 cursor-pointer"
          >
            <img
              src={photo}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{c.user.name}</p>

              <p className="text-sm text-white/60">
                {c.lastMessage?.text ?? "Say hello 👋"}
              </p>
            </div>

            {/* UNREAD BADGE */}
            {c.unreadCount > 0 && (
              <div className="bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {c.unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}