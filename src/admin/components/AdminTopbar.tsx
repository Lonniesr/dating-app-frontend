import { FiSearch, FiLogOut, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminNotifications from "./AdminNotifications";

export default function AdminTopbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        w-full h-16 
        bg-[#0f0f0f] 
        border-b border-[#1a1a1a] 
        flex items-center justify-between 
        px-6 rounded-xl
        shadow-lg shadow-black/30
      "
    >
      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-[#111] border border-[#222] px-4 py-2 rounded-lg w-80">
        <FiSearch className="text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Search users, invites, matches..."
          className="bg-transparent outline-none text-sm text-gray-300 w-full"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <AdminNotifications />

        {/* ADMIN AVATAR */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center">
            <FiUser className="text-[#d4af37] text-lg" />
          </div>
          <span className="text-gray-300 text-sm tracking-wide">
            Admin
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2 
            text-red-400 hover:text-red-300 
            transition text-sm
          "
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}