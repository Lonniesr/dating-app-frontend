import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

export default function DashboardPage() {
  const { authUser } = useUserAuth();
  const navigate = useNavigate();

  const [inviteStats, setInviteStats] = useState({
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

  const prefs = authUser.preferences;

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
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-yellow-400">
        Welcome, {authUser.name || "User"}
      </h1>

      {/* PROFILE COMPLETION */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profile Strength</h2>
          <span className="text-yellow-400 font-bold">
            {completionScore}%
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-yellow-400 h-full transition-all"
            style={{ width: `${completionScore}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-3">
          Profiles with photos and bios get more matches.
        </p>

      </section>

      {/* INVITE IMPACT */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <h2 className="text-xl font-semibold mb-6">
          Invite Impact
        </h2>

        <div className="grid grid-cols-2 gap-6 text-center">

          <div>
            <p className="text-3xl font-bold text-yellow-400">
              {inviteStats.sent}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Invites Sent
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-yellow-400">
              {inviteStats.joined}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Friends Joined
            </p>
          </div>

        </div>

      </section>

      {/* INVITE FRIENDS */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            Invite Friends
          </h2>

          <button
            onClick={() => navigate("/user/profile")}
            className="text-yellow-400 hover:underline text-sm"
          >
            Generate Invite
          </button>
        </div>

        <p className="text-gray-400">
          Invite friends to Lynq and grow your network.
        </p>

      </section>

      {/* PROFILE SUMMARY */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <h2 className="text-xl font-semibold mb-6">Profile Overview</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {authUser.photos?.length ?? 0}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Photos
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {authUser.bio ? "1" : "0"}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Bio
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {prefs ? "1" : "0"}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Preferences
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {authUser.prompts?.length ?? 0}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Prompts
            </p>
          </div>

        </div>

      </section>

      {/* PREFERENCES */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Preferences</h2>

          <button
            onClick={() => navigate("/user/settings")}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:opacity-90 transition"
          >
            Edit
          </button>
        </div>

        {prefs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Interested In
              </p>
              <p className="font-medium mt-1">
                {prefs.interestedIn || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Age Range
              </p>
              <p className="font-medium mt-1">
                {prefs.minAge ?? "?"} – {prefs.maxAge ?? "?"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Race Preference
              </p>
              <p className="font-medium mt-1">
                {prefs.racePreference || "No preference"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Distance
              </p>
              <p className="font-medium mt-1">
                {prefs.locationRadius == null
                  ? "Any distance"
                  : `${prefs.locationRadius} miles`}
              </p>
            </div>

          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            You haven’t set preferences yet.
            <button
              onClick={() => navigate("/user/settings")}
              className="ml-2 text-yellow-400 hover:underline"
            >
              Set them now
            </button>
          </div>
        )}

      </section>

      {/* DISCOVER */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Discover</h2>

          <button
            onClick={() => navigate("/user/discover")}
            className="text-yellow-400 hover:underline text-sm"
          >
            Start swiping
          </button>
        </div>

        <p className="text-gray-400">
          Find new people who match your preferences.
        </p>

      </section>

      {/* MATCHES */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Your Matches</h2>

          <button
            onClick={() => navigate("/user/matches")}
            className="text-yellow-400 hover:underline text-sm"
          >
            View matches
          </button>
        </div>

        <p className="text-gray-400">
          When you and someone like each other, they'll appear here.
        </p>

      </section>

      {/* MESSAGES */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Messages</h2>

          <button
            onClick={() => navigate("/user/messages")}
            className="text-yellow-400 hover:underline text-sm"
          >
            Open inbox
          </button>
        </div>

        <p className="text-gray-400">
          Start conversations with your matches.
        </p>

      </section>

    </div>
  );
}