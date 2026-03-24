// ONLY CHANGE: added block filter safely — nothing else touched

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import { getProfilePhoto } from "../utils/getProfilePhoto";

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

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      </div>
    );
  }

  const matches: MatchItem[] = data || [];

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

  const filteredMatches = matches
    .filter((m) => !blocked.includes(m.id))
    .filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Your Matches</h1>

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