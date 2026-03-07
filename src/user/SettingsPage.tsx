import { useState } from "react";
import apiClient from "../services/apiClient";

export default function SettingsPage() {

  const [inviteLink, setInviteLink] = useState("");

  const generateInvite = async () => {

    const res = await apiClient.post("/api/invite");

    setInviteLink(res.data.inviteLink);

    if (navigator.share) {
      navigator.share({
        title: "Join me on Lynq",
        url: res.data.inviteLink,
      });
    }

  };

  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <button
        onClick={generateInvite}
        className="bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold"
      >
        Generate Invite
      </button>

      {inviteLink && (
        <div className="mt-4 text-sm text-yellow-400">
          {inviteLink}
        </div>
      )}

    </div>
  );
}