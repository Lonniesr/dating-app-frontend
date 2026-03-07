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

      <div className="bg-black border-t border-white/10 flex items-center h-16">

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

        {/* Discover */}
        <NavLink
          to={userNav.discover.path}
          className={`${base} ${
            isActive(userNav.discover.path) ? active : inactive
          }`}
        >
          <Flame size={22} />
          {userNav.discover.label}
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