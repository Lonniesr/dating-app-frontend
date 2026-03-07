import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");

      // redirect to login after logout
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

        {/* Invite Friends */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">
            Invite Friends
          </h2>
          <p className="text-white/60 text-sm">
            Share invites to grow the Lynq network.
          </p>
        </div>

        {/* Profile Verification */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">
            Profile Verification
          </h2>
          <p className="text-white/60 text-sm">
            Verify your account with a selfie to earn the verified badge.
          </p>
        </div>

        {/* Logout */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-3">
            Account
          </h2>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}