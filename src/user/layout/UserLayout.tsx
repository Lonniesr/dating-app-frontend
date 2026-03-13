import { Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileNav from "../layout/MobileNav";

type BadgeCounts = {
  unreadMessages: number;
  newLikes: number;
  newMatches: number;
};

export default function UserLayout() {
  const [badges, setBadges] = useState<BadgeCounts>({
    unreadMessages: 0,
    newLikes: 0,
    newMatches: 0,
  });

  const base =
    "flex items-center justify-between px-4 py-2 rounded-lg transition font-medium";
  const inactive =
    "text-white/70 hover:text-yellow-400 hover:bg-white/5";
  const active =
    "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";

  useEffect(() => {
    async function loadBadges() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications/badges`,
          { credentials: "include" }
        );

        if (!res.ok) return;

        const data = await res.json();

        setBadges({
          unreadMessages: data.unreadMessages ?? 0,
          newLikes: data.newLikes ?? 0,
          newMatches: data.newMatches ?? 0,
        });
      } catch (err) {
        console.error("Badge load failed", err);
      }
    }

    loadBadges();

    const interval = setInterval(loadBadges, 15000);

    return () => clearInterval(interval);
  }, []);

  function Badge({ count }: { count: number }) {
    if (!count) return null;

    return (
      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {count > 99 ? "99+" : count}
      </span>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-8 text-yellow-500">
          Lynq
        </h1>

        <nav className="space-y-2">
          <NavLink
            to="discover"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <span>Discover</span>
          </NavLink>

          <NavLink
            to="matches"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <span>Matches</span>
            <Badge count={badges.newMatches + badges.newLikes} />
          </NavLink>

          <NavLink
            to="messages"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <span>Messages</span>
            <Badge count={badges.unreadMessages} />
          </NavLink>

          <NavLink
            to="profile"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="settings"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 pb-24">
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}