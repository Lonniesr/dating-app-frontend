import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    invites: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("lynq_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  const updateNotification = (key: string) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    };

    setNotifications(updated);
    localStorage.setItem("lynq_notifications", JSON.stringify(updated));
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Password update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
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

      <div className="space-y-6">

        {/* Invite Friends */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">
            Invite Friends
          </h2>

          <button
            onClick={() => navigate("/user/profile")}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold"
          >
            Generate Invite
          </button>
        </div>

        {/* Profile Verification */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-2">
            Profile Verification
          </h2>

          <button
            onClick={() => navigate("/user/verify")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Verify Profile
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">
            Notifications
          </h2>

          <div className="space-y-3">

            <label className="flex justify-between items-center">
              <span>New Matches</span>
              <input
                type="checkbox"
                checked={notifications.matches}
                onChange={() => updateNotification("matches")}
              />
            </label>

            <label className="flex justify-between items-center">
              <span>Messages</span>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={() => updateNotification("messages")}
              />
            </label>

            <label className="flex justify-between items-center">
              <span>Invite Activity</span>
              <input
                type="checkbox"
                checked={notifications.invites}
                onChange={() => updateNotification("invites")}
              />
            </label>

          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">

          <h2 className="text-lg font-semibold mb-4">
            Change Password
          </h2>

          <div className="space-y-3">

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
            />

            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </div>

        </div>

        {/* Logout */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">

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