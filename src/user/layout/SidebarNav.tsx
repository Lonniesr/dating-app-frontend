import { NavLink } from "react-router-dom";
import { userNav } from "../nav/UserNavConfig";

export default function SidebarNav() {
  const base = "block px-4 py-3 rounded-lg transition font-medium";
  const inactive = "text-white/70 hover:bg-white/10";
  const active = "bg-white/10 text-yellow-400 border border-white/10";

  return (
    <aside className="w-60 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block">
      <h1 className="text-2xl font-bold mb-8 text-yellow-500">Lynq</h1>

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
          {userNav.matches.label}
        </NavLink>

        <NavLink
          to={userNav.messages.path}
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          {userNav.messages.label}
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
