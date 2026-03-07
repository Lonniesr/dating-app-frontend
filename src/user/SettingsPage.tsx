import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const generateInvite = async () => {
    try {
      setLoadingInvite(true);

      const res = await apiClient.post("/api/invite");

      setInviteLink(res.data.inviteLink);

      if (navigator.share) {
        await navigator.share({
          title: "Join me on Lynq",
          text: "Use my invite to join Lynq.",
          url: res.data.inviteLink,
        });
      }

    } catch (err) {
      console.error("Invite generation failed", err);
    } finally {
      setLoadingInvite(false);
    }
  };

  const copyInvite = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">
        Settings
      </h1>

      {/* INVITE FRIENDS */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">

        <h2 className="text-lg font-semibold">
          Invite Friends
        </h2>

        <p className="text-sm text-gray-400">
          Grow the Lynq community by inviting friends.
        </p>

        <button
          onClick={generateInvite}
          disabled={loadingInvite}
          className="w-full px-4 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loadingInvite ? "Creating invite..." : "Generate Invite"}
        </button>

        {inviteLink && (
          <div className="bg-black/40 p-3 rounded-lg text-sm break-all">

            <p className="mb-2 text-gray-400">
              Your Invite Link
            </p>

            <p className="text-yellow-400">
              {inviteLink}
            </p>

            <button
              onClick={copyInvite}
              className="mt-3 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs"
            >
              Copy Link
            </button>

          </div>
        )}

      </div>

      {/* ACCOUNT */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-4">

        <h2 className="text-lg font-semibold">
          Account
        </h2>

        <button
          onClick={() => navigate("/user/profile")}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 transition rounded-lg font-semibold"
        >
          View Profile
        </button>

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