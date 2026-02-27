import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiLogIn,
  FiUser,
  FiImage,
  FiHeart,
  FiMessageSquare,
  FiSend,
  FiShield,
} from "react-icons/fi";

interface ActivityEvent {
  id: string;
  type: string;
  timestamp: string;
  meta?: any;
}

export default function UserActivityTimeline({ userId }: { userId: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_API_URL + `/api/admin/user/${userId}/activity`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setEvents(res.data.events || []))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="text-gray-400 text-sm">Loading activity timeline…</div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No activity recorded for this user.
      </div>
    );
  }

  const iconMap: Record<string, JSX.Element> = {
    login: <FiLogIn className="text-blue-400" />,
    profile_update: <FiUser className="text-yellow-400" />,
    photo_upload: <FiImage className="text-purple-400" />,
    match: <FiHeart className="text-pink-400" />,
    message: <FiMessageSquare className="text-green-400" />,
    invite_sent: <FiSend className="text-amber-400" />,
    admin_action: <FiShield className="text-red-400" />,
  };

  return (
    <motion.div
      className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 shadow-lg shadow-black/40 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold text-[#d4af37]">
        Activity Timeline
      </h2>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4 items-start">
            {/* ICON */}
            <div className="text-2xl">{iconMap[event.type] || <FiUser />}</div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="text-white text-sm font-medium capitalize">
                {formatEventLabel(event)}
              </p>

              {event.meta && (
                <p className="text-gray-400 text-xs mt-1">
                  {formatEventMeta(event)}
                </p>
              )}

              <p className="text-gray-500 text-xs mt-1">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatEventLabel(event: ActivityEvent) {
  switch (event.type) {
    case "login":
      return "User logged in";
    case "profile_update":
      return "Profile updated";
    case "photo_upload":
      return "Uploaded a new photo";
    case "match":
      return "Matched with another user";
    case "message":
      return "Sent a message";
    case "invite_sent":
      return "Sent an invite";
    case "admin_action":
      return "Admin performed an action";
    default:
      return event.type;
  }
}

function formatEventMeta(event: ActivityEvent) {
  if (!event.meta) return "";

  switch (event.type) {
    case "match":
      return `Matched with: ${event.meta.otherUserName}`;
    case "message":
      return `Message: "${event.meta.preview}"`;
    case "invite_sent":
      return `Invite code: ${event.meta.code}`;
    case "admin_action":
      return `Action: ${event.meta.action}`;
    default:
      return JSON.stringify(event.meta);
  }
}