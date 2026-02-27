import { Outlet, NavLink } from "react-router-dom";

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

      {/* Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 p-8">
        {/* Main */}
        <main className="space-y-6">
          <Outlet />
        </main>

        {/* Right Panel (Profile Preview) */}
        <aside className="hidden lg:block">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              My Profile
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neutral-700 rounded-full" />
              <div>
                <p className="font-medium">Lion</p>
                <p className="text-sm text-neutral-400">
                  Gender preference...
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}