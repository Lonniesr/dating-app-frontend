import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiHeart,
  FiMessageSquare,
  FiSend,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";

import { getAdminSocket } from "../lib/socket";

interface Notification {
  id: string;
  type: string;
  timestamp: string;
  message: string;
  meta?: any;
}

// ----------------------
// FORMAT META
// ----------------------
function formatMeta(n: Notification) {
  if (!n.meta) return "";

  switch (n.type) {
    case "signup":
      return `New user: ${n.meta.name}`;
    case "match":
      return `Match between ${n.meta.userA} & ${n.meta.userB}`;
    case "message":
      return `Message preview: "${n.meta.preview}"`;
    case "invite":
      return `Invite code: ${n.meta.code}`;
    case "admin_action":
      return `Action: ${n.meta.action}`;
    default:
      return JSON.stringify(n.meta);
  }
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  // ----------------------
  // INITIAL LOAD
  // ----------------------
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data.notifications || []));
  }, []);

  // ----------------------
  // WEBSOCKET LIVE UPDATES
  // ----------------------
  useEffect(() => {
    const socket = getAdminSocket();
    if (!socket) return;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "notification") {
          setNotifications((prev) => [data.payload, ...prev]);
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    };
  }, []);

  const iconMap: Record<string, JSX.Element> = {
    signup: <FiUserPlus className="text-green-400" />,
    match: <FiHeart className="text-pink-400" />,
    message: <FiMessageSquare className="text-blue-400" />,
    invite: <FiSend className="text-amber-400" />,
    warning: <FiAlertTriangle className="text-yellow-400" />,
    admin_action: <FiShield className="text-red-400" />,
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-[#d4af37] hover:text-white transition"
      >
        <FiAlertTriangle className="text-2xl" />

        {notifications.length > 0 && (
          <span
            className="
              absolute -top-1 -right-1 
              bg-red-500 text-white text-[10px] 
              px-1.5 py-0.5 rounded-full
            "
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              absolute right-0 mt-3 w-96 
              bg-[#0f0f0f] border border-[#1f1f1f] 
              rounded-xl shadow-xl shadow-black/40 
              p-4 z-50
            "
          >
            <h2 className="text-lg font-semibold text-[#d4af37] mb-4">
              Notifications
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {notifications.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No notifications yet.
                </p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 items-start border-b border-[#222] pb-3"
                >
                  <div className="text-xl">
                    {iconMap[n.type] || <FiAlertTriangle />}
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-sm">{n.message}</p>

                    {n.meta && (
                      <p className="text-gray-400 text-xs mt-1">
                        {formatMeta(n)}
                      </p>
                    )}

                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(n.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}