import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../user/context/UserAuthContext";
import apiClient from "../services/apiClient";
import DeleteAccountSection from "../user/settings/DeleteAccountSection";

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
    return <div className="p-6 text-white">Loading settings…</div>;
  }

  return (
    <div className="p-6 text-white max-w-xl mx-auto pb-28">

      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">

        {/* 🔹 ACCOUNT ACTIONS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <h2 className="font-semibold">Account</h2>

          <button
            onClick={() => navigate("/user/edit-profile")}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg"
          >
            Edit Profile
          </button>

          {!authUser?.verified && (
            <button
              onClick={() => navigate("/user/verify-selfie")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Get Verified
            </button>
          )}
        </div>

        {/* 🔹 NOTIFICATIONS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <h2 className="font-semibold">Notifications</h2>

          <label className="flex justify-between items-center">
            Messages
            <input
              type="checkbox"
              checked={messageNotifications}
              onChange={(e) => setMessageNotifications(e.target.checked)}
            />
          </label>

          <label className="flex justify-between items-center">
            Matches
            <input
              type="checkbox"
              checked={matchNotifications}
              onChange={(e) => setMatchNotifications(e.target.checked)}
            />
          </label>

          <label className="flex justify-between items-center">
            Marketing
            <input
              type="checkbox"
              checked={marketingNotifications}
              onChange={(e) => setMarketingNotifications(e.target.checked)}
            />
          </label>

          <button
            onClick={saveNotifications}
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
          >
            {savingNotifications ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        {/* 🔹 PASSWORD */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <h2 className="font-semibold">Change Password</h2>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/40"
          />

          <button
            onClick={changePassword}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Update Password
          </button>

          {passwordMessage && (
            <p className="text-sm text-white/70">{passwordMessage}</p>
          )}
        </div>

        {/* 🔹 LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Logout
        </button>

        {/* 🔥 DELETE ACCOUNT */}
        <DeleteAccountSection />

      </div>

    </div>
  );
}