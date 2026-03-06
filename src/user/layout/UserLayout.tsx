import { Outlet, NavLink } from "react-router-dom";
import MobileNav from "../layout/MobileNav"; // ✅ add this

export default function UserLayout() {
  const base = "block px-4 py-2 rounded-lg transition font-medium";
  const inactive =
    "text-white/70 hover:text-yellow-400 hover:bg-white/5";
  const active =
    "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";

  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-8 text-yellow-500">
          Lynq
        </h1>

        <nav className="space-y-2">
          {[
            { to: "dashboard", label: "Discover" },
            { to: "matches", label: "Matches" },
            { to: "messages", label: "Messages" },
            { to: "profile", label: "My Profile" },
            { to: "settings", label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              {item.label}
            </NavLink>
          ))}
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