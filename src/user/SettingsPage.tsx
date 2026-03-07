import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");

      // redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="space-y-4">

        {/* Edit Profile */}
        <button
          onClick={() => navigate("/user/edit-profile")}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition rounded-lg text-left"
        >
          Edit Profile
        </button>

        {/* Notifications */}
        <button
          onClick={() => alert("Notifications settings coming soon")}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition rounded-lg text-left"
        >
          Notifications
        </button>

        {/* Invite Friends */}
        <button
          onClick={() => navigate("/user/profile")}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition rounded-lg text-left"
        >
          Invite Friends
        </button>

        {/* Profile Verification */}
        <button
          onClick={() => navigate("/user/verify")}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition rounded-lg text-left"
        >
          Profile Verification
        </button>

        {/* Change Password */}
        <button
          onClick={() => alert("Password change coming soon")}
          className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 transition rounded-lg text-left"
        >
          Change Password
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}