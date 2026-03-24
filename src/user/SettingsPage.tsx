import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../user/context/UserAuthContext";
import apiClient from "../services/apiClient";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { authUser } = useUserAuth();

  const [messageNotifications, setMessageNotifications] = useState(false);
  const [matchNotifications, setMatchNotifications] = useState(false);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  const [savingNotifications, setSavingNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!authUser) return;

    const prefs = authUser.preferences || {};

    setMessageNotifications(prefs.messageNotifications ?? true);
    setMatchNotifications(prefs.matchNotifications ?? true);
    setMarketingNotifications(prefs.marketingNotifications ?? false);

    setLoading(false);

  }, [authUser]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const changePassword = async () => {
    if (!password) {
      setPasswordMessage("Enter a new password.");
      return;
    }

    try {
      await apiClient.post("/api/auth/change-password", { password });

      setPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch (err) {
      console.error(err);
      setPasswordMessage("Password update failed.");
    }
  };

  const saveNotifications = async () => {
    try {
      setSavingNotifications(true);

      await apiClient.put("/api/settings/notifications", {
        messageNotifications,
        matchNotifications,
        marketingNotifications,
      });

    } catch (err) {
      console.error("Failed to update notifications", err);
    } finally {
      setSavingNotifications(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading settings…
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="space-y-6">

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <h2 className="font-semibold mb-3 text-white/70">
            Account
          </h2>

          <div className="space-y-2">

            <button
              onClick={() => navigate("/user/edit-profile")}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-left"
            >
              Edit Profile
            </button>

            <button
              onClick={() => navigate("/user/profile")}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-left"
            >
              Invite Friends
            </button>

            {/* ✅ FIXED HERE */}
            <button
              onClick={() => navigate("/user/profile")}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-left"
            >
              Profile Verification
            </button>

          </div>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <h2 className="font-semibold mb-3 text-white/70">
            Notifications
          </h2>

          <div className="space-y-3">

            <label className="flex items-center justify-between">
              <span>Messages</span>
              <input
                type="checkbox"
                checked={messageNotifications}
                onChange={() => setMessageNotifications(!messageNotifications)}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>New Matches</span>
              <input
                type="checkbox"
                checked={matchNotifications}
                onChange={() => setMatchNotifications(!matchNotifications)}
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Marketing</span>
              <input
                type="checkbox"
                checked={marketingNotifications}
                onChange={() =>
                  setMarketingNotifications(!marketingNotifications)
                }
              />
            </label>

          </div>

          <button
            onClick={saveNotifications}
            disabled={savingNotifications}
            className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
          >
            {savingNotifications ? "Saving..." : "Save Notification Settings"}
          </button>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <h2 className="font-semibold mb-3 text-white/70">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded bg-white/10 border border-white/20"
          />

          <button
            onClick={changePassword}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
          >
            Update Password
          </button>

          {passwordMessage && (
            <p className="text-sm text-white/70 mt-2">
              {passwordMessage}
            </p>
          )}

        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}