import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../user/context/UserAuthContext";
import apiClient from "../services/apiClient";
import DeleteAccountSection from "../user/settings/DeleteAccountSection"; // ✅ ADDED

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
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="space-y-6">

        {/* ALL YOUR EXISTING SECTIONS UNCHANGED */}

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Logout
        </button>

        {/* 🔥 DELETE ACCOUNT AT BOTTOM */}
        <DeleteAccountSection />

      </div>

    </div>
  );
}