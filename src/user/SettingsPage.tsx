import { useState } from "react";
import apiClient from "../services/apiClient";

export default function SettingsPage() {

  const [inviteLink, setInviteLink] = useState("");
  const [verified, setVerified] = useState(false);

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

  const requestVerification = async () => {
    try {

      const res = await apiClient.post("/api/user/verify");

      if (res.data.verified) {
        setVerified(true);
        alert("Profile verified!");
      }

    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  return (
    <div className="p-6 text-white space-y-6">

      <h1 className="text-2xl font-bold">
        Settings
      </h1>

      {/* INVITE FRIENDS */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10">

        <h2 className="text-lg font-semibold mb-4">
          Invite Friends
        </h2>

        <button
          onClick={generateInvite}
          className="bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold"
        >
          Generate Invite
        </button>

        {inviteLink && (
          <p className="text-yellow-400 mt-3 text-sm">
            {inviteLink}
          </p>
        )}

      </div>

      {/* PROFILE VERIFICATION */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10">

        <h2 className="text-lg font-semibold mb-4">
          Profile Verification
        </h2>

        {verified ? (
          <p className="text-blue-400 font-semibold">
            ✔ Your profile is verified
          </p>
        ) : (
          <button
            onClick={requestVerification}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold"
          >
            Request Verification
          </button>
        )}

      </div>

    </div>
  );
}