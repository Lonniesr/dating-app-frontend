import axios from "axios";
import { motion } from "framer-motion";
import {
  FiSlash,
  FiUserX,
  FiImage,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";

export default function ModerationTools({ userId }: { userId: string }) {
  const token = localStorage.getItem("adminToken");

  async function action(endpoint: string, label: string) {
    const confirm = window.confirm(`Are you sure you want to ${label}?`);
    if (!confirm) return;

    try {
      await axios.post(
        import.meta.env.VITE_API_URL + endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${label} completed successfully.`);
    } catch (err) {
      console.error("MODERATION ERROR:", err);
      alert(`Failed to ${label}.`);
    }
  }

  const tools = [
    {
      label: "Ban User",
      icon: <FiSlash />,
      endpoint: `/api/admin/user/${userId}/ban`,
      color: "text-red-400",
    },
    {
      label: "Disable Profile",
      icon: <FiUserX />,
      endpoint: `/api/admin/user/${userId}/disable`,
      color: "text-orange-400",
    },
    {
      label: "Reset Photos",
      icon: <FiImage />,
      endpoint: `/api/admin/user/${userId}/reset-photos`,
      color: "text-yellow-400",
    },
    {
      label: "Wipe Matches",
      icon: <FiHeart />,
      endpoint: `/api/admin/user/${userId}/wipe-matches`,
      color: "text-pink-400",
    },
    {
      label: "Wipe Messages",
      icon: <FiMessageSquare />,
      endpoint: `/api/admin/user/${userId}/wipe-messages`,
      color: "text-blue-400",
    },
  ];

  return (
    <motion.div
      className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl p-6 shadow-lg shadow-black/40 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-xl font-semibold text-[#d4af37] mb-4">
        Moderation Tools
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={() => action(tool.endpoint, tool.label)}
            className="
              flex items-center gap-3
              bg-[#111] border border-[#222]
              px-4 py-3 rounded-lg
              hover:bg-[#1a1a1a] transition
              text-left
            "
          >
            <span className={`${tool.color} text-xl`}>{tool.icon}</span>
            <span className="text-gray-300">{tool.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}