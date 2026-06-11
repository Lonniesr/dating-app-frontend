import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { userNav } from "../nav/UserNavConfig";

export default function SidebarNav() {
    const [unreadCount, setUnreadCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications/badges`,
          {
            credentials: "include",
          }
        );

        const badges = await res.json();

        setUnreadCount(badges.unreadMessages || 0);
        setMatchCount(badges.newMatches || 0);
      } catch (err) {
        console.error("Failed loading badges", err);
      }
    };

    loadBadges();
  }, []);
  const base = "block px-4 py-3 rounded-lg transition font-medium";
  const inactive = "text-white/70 hover:bg-white/10";
  const active = "bg-white/10 text-yellow-400 border border-white/10";

  return (
    <aside className="w-60 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block overflow-y-auto h-screen">      <h1 className="text-2xl font-bold mb-8 text-yellow-500">Lynq</h1>

      <nav className="space-y-2">
        <NavLink
          to={userNav.discover.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {userNav.discover.label}
        </NavLink>

        <NavLink
          to={userNav.invite.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {userNav.invite.label}
        </NavLink>

        <NavLink
          to={userNav.matches.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
<div className="flex items-center justify-between w-full">
  <span>{userNav.matches.label}</span>

  {matchCount > 0 && (
    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
      {matchCount}
    </span>
  )}
</div>
        </NavLink>

        <NavLink
          to={userNav.messages.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
<div className="flex items-center justify-between w-full">
  <span>{userNav.messages.label}</span>

  {unreadCount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {unreadCount}
    </span>
  )}
</div>
        </NavLink>

        <NavLink
          to={userNav.profile.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {userNav.profile.label}
        </NavLink>

        <NavLink
          to={userNav.settings.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {userNav.settings.label}
        </NavLink>
      </nav>
    </aside>
  );
}