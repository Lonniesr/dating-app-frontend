import { motion } from "framer-motion";

type ChatUser = {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
};

type ChatMessage = {
  text?: string;
  createdAt?: string;
};

type Conversation = {
  conversationId: string;
  user: ChatUser;
  lastMessage?: ChatMessage;
  unreadCount: number;
};

type ChatListProps = {
  conversations: Conversation[];
  onSelect: (userId: string) => void;
};

function formatTime(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatList({ conversations, onSelect }: ChatListProps) {
  if (!conversations.length) {
    return (
      <div className="text-white/60 text-sm px-2">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((c) => (
        <motion.button
          key={c.conversationId}
          onClick={() => onSelect(c.user.id)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left"
        >
          {/* Avatar + Presence */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden border border-white/20 flex items-center justify-center text-sm">
              {c.user.avatar ? (
                <img
                  src={c.user.avatar}
                  alt={c.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{c.user.name?.charAt(0)}</span>
              )}
            </div>

            <span
              className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border border-black ${
                c.user.online ? "bg-green-400" : "bg-gray-500"
              }`}
            />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold truncate">{c.user.name}</p>
              <p className="text-[10px] text-white/40">
                {formatTime(c.lastMessage?.createdAt)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-white/60 truncate max-w-[200px]">
                {c.lastMessage?.text ?? "Say hi 👋"}
              </p>

              {c.unreadCount > 0 && (
                <span className="ml-2 bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full">
                  {c.unreadCount}
                </span>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
