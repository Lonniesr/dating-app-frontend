import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

interface InviteStats {
  sent: number;
  joined: number;
}

export default function DashboardPage() {
  const { authUser } = useUserAuth();
  const navigate = useNavigate();

  const [inviteStats, setInviteStats] = useState<InviteStats>({
    sent: 0,
    joined: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await apiClient.get("/api/invite/stats");
        setInviteStats(res.data);
      } catch (err) {
        console.error("Invite stats failed", err);
      }
    };

    loadStats();
  }, []);

  if (!authUser) {
    return (
      <div className="text-center text-gray-400 mt-20">
        Loading dashboard...
      </div>
    );
  }

  const completionItems = [
    (authUser.photos?.length ?? 0) > 0,
    !!authUser.bio,
    !!authUser.gender,
    !!authUser.preferences,
  ];

  const completionScore = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}

      <h1 className="text-2xl font-bold text-yellow-400">
        Welcome, {authUser.name || "User"}
      </h1>

      {/* PROFILE COMPLETION */}

      <section className="bg-white/5 p-5 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Profile Strength</h2>
          <span className="text-yellow-400 font-bold">
            {completionScore}%
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-yellow-400 h-full"
            style={{ width: `${completionScore}%` }}
          />
        </div>

        <button
          onClick={() => navigate("/user/edit-profile")}
          className="mt-4 text-sm text-yellow-400 hover:underline"
        >
          Improve Profile
        </button>

      </section>

      {/* QUICK ACTIONS */}

      <section className="grid grid-cols-2 gap-4">

        <button
          onClick={() => navigate("/user/discover")}
          className="bg-white/5 border border-white/10 p-5 rounded-xl text-left hover:bg-white/10 transition"
        >
          <h3 className="font-semibold mb-1">
            Discover
          </h3>
          <p className="text-sm text-gray-400">
            Start swiping
          </p>
        </button>

        <button
          onClick={() => navigate("/user/matches")}
          className="bg-white/5 border border-white/10 p-5 rounded-xl text-left hover:bg-white/10 transition"
        >
          <h3 className="font-semibold mb-1">
            Matches
          </h3>
          <p className="text-sm text-gray-400">
            View your matches
          </p>
        </button>

        <button
          onClick={() => navigate("/user/messages")}
          className="bg-white/5 border border-white/10 p-5 rounded-xl text-left hover:bg-white/10 transition"
        >
          <h3 className="font-semibold mb-1">
            Messages
          </h3>
          <p className="text-sm text-gray-400">
            Open conversations
          </p>
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className="bg-white/5 border border-white/10 p-5 rounded-xl text-left hover:bg-white/10 transition"
        >
          <h3 className="font-semibold mb-1">
            Invite Friends
          </h3>
          <p className="text-sm text-gray-400">
            Grow your network
          </p>
        </button>

      </section>

      {/* INVITE STATS */}

      <section className="bg-white/5 p-5 rounded-xl border border-white/10">

        <h2 className="font-semibold mb-4">
          Invite Impact
        </h2>

        <div className="grid grid-cols-2 text-center gap-4">

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {inviteStats.sent}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Sent
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {inviteStats.joined}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Joined
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}