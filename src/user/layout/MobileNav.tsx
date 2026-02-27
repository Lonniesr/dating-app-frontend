import { NavLink, useLocation } from "react-router-dom";
import { Home, User, MessageCircle, Users, Flame } from "lucide-react";
import { userNav } from "../nav/UserNavConfig";

export default function MobileNav() {
  const location = useLocation();

  const base =
    "flex flex-col items-center justify-center flex-1 py-2 text-xs transition font-medium relative select-none";
  const inactive = "text-white/60";
  const active = "text-yellow-400";

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[90%] h-10 bg-black/40 blur-2xl rounded-full" />

      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-20 text-black/40 backdrop-blur-xl pointer-events-auto"
        viewBox="0 0 100 25"
        preserveAspectRatio="none"
      >
        <path d="M0 0 H100 V25 H0 Z" fill="rgba(0,0,0,0.4)" />
      </svg>

      <nav className="relative flex items-end justify-between px-4 pb-2 pointer-events-auto">
        {/* Discover */}
        <NavLink
          to={userNav.discover.path}
          className={`${base} ${
            isActive(userNav.discover.path) ? active : inactive
          }`}
        >
          <Home
            size={24}
            className={`mb-1 transition-all duration-300 ${
              isActive(userNav.discover.path)
                ? "scale-125 text-yellow-400"
                : "scale-100 opacity-80"
            }`}
          />
          {userNav.discover.label}
        </NavLink>



        {/* Floating Center Button */}
        <div className="relative flex justify-center flex-1 -mt-14">
          <div className="absolute w-24 h-24 bg-yellow-500/30 blur-3xl rounded-full -z-10" />
          <div className="absolute w-16 h-16 bg-yellow-400/40 blur-xl rounded-full -z-10" />

          <NavLink
            to={userNav.discover.path}
            className="
              bg-yellow-500 text-black 
              w-16 h-16 rounded-full 
              flex items-center justify-center 
              shadow-xl border border-yellow-300 
              transition-all 
              hover:scale-110 active:scale-95
            "
          >
            <Flame size={34} />
          </NavLink>
        </div>

        {/* Matches */}
        <NavLink
          to={userNav.matches.path}
          className={`${base} ${
            isActive(userNav.matches.path) ? active : inactive
          }`}
        >
          <Users size={24} className="mb-1 opacity-80" />
          {userNav.matches.label}
        </NavLink>

        {/* Messages */}
        <NavLink
          to={userNav.messages.path}
          className={`${base} ${
            isActive(userNav.messages.path) ? active : inactive
          }`}
        >
          <MessageCircle size={24} className="mb-1 opacity-80" />
          {userNav.messages.label}
        </NavLink>

        {/* Profile */}
        <NavLink
          to={userNav.profile.path}
          className={`${base} ${
            isActive(userNav.profile.path) ? active : inactive
          }`}
        >
          <User size={24} className="mb-1 opacity-80" />
          {userNav.profile.label}
        </NavLink>
      </nav>
    </div>
  );
}
