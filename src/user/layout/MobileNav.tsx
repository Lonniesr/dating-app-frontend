import { NavLink, useLocation } from "react-router-dom";
import { MessageCircle, Users, Flame, User, Settings } from "lucide-react";
import { userNav } from "../nav/UserNavConfig";

export default function MobileNav() {
  const location = useLocation();

  const base =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs transition font-medium";

  const inactive = "text-white/60";
  const active = "text-yellow-400";

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">

      <div className="bg-black border-t border-white/10 flex items-center h-16 relative">

        {/* Matches */}
        <NavLink
          to={userNav.matches.path}
          className={`${base} ${
            isActive(userNav.matches.path) ? active : inactive
          }`}
        >
          <Users size={22} />
          {userNav.matches.label}
        </NavLink>

        {/* Messages */}
        <NavLink
          to={userNav.messages.path}
          className={`${base} ${
            isActive(userNav.messages.path) ? active : inactive
          }`}
        >
          <MessageCircle size={22} />
          {userNav.messages.label}
        </NavLink>

        {/* CENTER SWIPE BUTTON */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-6">

          <NavLink
            to={userNav.discover.path}
            className="bg-yellow-500 text-black w-16 h-16 rounded-full flex items-center justify-center shadow-xl border border-yellow-300 hover:scale-110 transition"
          >
            <Flame size={32} />
          </NavLink>

        </div>

        {/* Profile */}
        <NavLink
          to={userNav.profile.path}
          className={`${base} ${
            isActive(userNav.profile.path) ? active : inactive
          }`}
        >
          <User size={22} />
          {userNav.profile.label}
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/user/settings"
          className={`${base} ${
            isActive("/user/settings") ? active : inactive
          }`}
        >
          <Settings size={22} />
          Settings
        </NavLink>

      </div>
    </div>
  );
}