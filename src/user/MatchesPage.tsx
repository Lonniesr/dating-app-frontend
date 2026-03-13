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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const matches: MatchItem[] = data || [];

  const filteredMatches = matches.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  if (matches.length === 0) {
    return (
      <div className="p-6 text-white text-center">

        <h1 className="text-2xl font-bold mb-4">Your Matches</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl p-10">

          <p className="text-white/60 mb-4">
            You have no matches yet.
          </p>

          <button
            onClick={() => navigate("/user/discover")}
            className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Start Swiping
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <h1 className="text-2xl font-bold">Your Matches</h1>

        <input
          type="text"
          placeholder="Search matches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
        />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {filteredMatches.map((match: MatchItem) => {
          const primaryPhoto = getProfilePhoto(match.photos);

          return (
            <div
              key={match.id}
              onClick={() => navigate(`/user/messages/${match.id}`)}
              className="group flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition cursor-pointer relative"
            >

              <div className="relative">

                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                  <img
                    src={primaryPhoto}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {match.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-black rounded-full" />
                )}

              </div>

              <div className="flex-1 min-w-0">

                <p className="font-semibold text-lg truncate">
                  {match.name}
                  {match.age ? `, ${match.age}` : ""}
                </p>

                <p className="text-white/60 text-sm truncate">
                  {match.lastMessage || match.gender || "Say hello 👋"}
                </p>

              </div>

              {match.unreadCount && match.unreadCount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {match.unreadCount}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/messages/${match.id}`);
                }}
                className="opacity-0 group-hover:opacity-100 transition text-sm bg-yellow-500 text-black px-3 py-1 rounded-lg"
              >
                Chat
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}