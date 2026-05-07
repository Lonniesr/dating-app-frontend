// ONLY CHANGE: fixed hook order (no logic changes)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import { getProfilePhoto } from "../utils/getProfilePhoto";
import axios from "axios";

interface MatchItem {
  id: string;
  name: string;
  gender?: string;
  photos?: string[];
  age?: number;
  lastMessage?: string;
  unreadCount?: number;
  online?: boolean;
}

export default function MatchesPage() {
  const { data, isLoading } = useMatches();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [requestCount, setRequestCount] = useState(0);

  /* =========================
     BLOCK FILTER (ADDED)
  ========================= */
  const blocked = (() => {
    try {
      return JSON.parse(localStorage.getItem("blockedUsers") || "[]");
    } catch {
      return [];
    }
  })();

  async function loadRequestCount() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/photo-access/incoming`,
        { withCredentials: true }
      );

      setRequestCount(res.data?.length || 0);
    } catch (err) {
      console.error("Failed to load request count", err);
    }
  }

  // ✅ ALWAYS ABOVE RETURN
  useEffect(() => {
    loadRequestCount();

    const interval = setInterval(loadRequestCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const matches: MatchItem[] = data || [];

  const filteredMatches = matches
    .filter((m) => !blocked.includes(m.id))
    .filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

  // ✅ RETURN AFTER HOOKS
  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Matches</h1>

        <button
          onClick={() => navigate("/user/requests")}
          className="bg-pink-500 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          Requests

          {requestCount > 0 && (
            <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {requestCount}
            </span>
          )}
        </button>
      </div>

      {/* MATCH GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map((match: MatchItem) => {
          const primaryPhoto =
            getProfilePhoto(match.photos) || "/default-avatar.png";

          return (
            <div
              key={match.id}
              onClick={() => navigate(`/user/messages/${match.id}`)}
              className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                <img
                  src={primaryPhoto}
                  alt={match.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {match.name}
                  {match.age ? `, ${match.age}` : ""}
                </p>

                <p className="text-white/60 text-sm">
                  {match.lastMessage || "Say hello 👋"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}