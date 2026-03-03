import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Search,
  Shield,
  Settings,
  Mail,
  CheckCircle,
  Heart,
  MessageSquare,
  ArrowRightLeft,
  Ban,
  StickyNote,
  CreditCard,
  Bell,
  Activity,
  Link2,
  ChevronRight,
  PanelLeftClose,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

interface SidebarSectionProps {
  title: string;
  collapsed: boolean;
}

export default function SlideInSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-72"}
        transition-all duration-300
        bg-gradient-to-b from-[#0f0f12] to-[#0c0c0f]
        border-r border-[#1c1c22]
        min-h-screen
        shadow-2xl
      `}
    >
      <div className="h-full overflow-y-auto p-6 space-y-8">

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 text-gray-400 hover:text-gold transition"
        >
          <PanelLeftClose size={18} />
          {!collapsed && (
            <span className="text-sm font-medium tracking-wide">
              Collapse
            </span>
          )}
        </button>

        <SidebarSection title="Overview" collapsed={collapsed} />
        <NavItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />

        <SidebarSection title="Users" collapsed={collapsed} />
        <NavItem to="/admin/users" icon={<Users size={18} />} label="Users" collapsed={collapsed} />
        <NavItem to="/admin/search" icon={<Search size={18} />} label="User Search" collapsed={collapsed} />

        <SidebarSection title="Admin Tools" collapsed={collapsed} />
        <NavItem to="/admin/roles" icon={<Shield size={18} />} label="Roles" collapsed={collapsed} />

        <SidebarSection title="System" collapsed={collapsed} />
        <NavItem to="/admin/settings" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} />
        <NavItem to="/admin/invites" icon={<Mail size={18} />} label="Invites" collapsed={collapsed} />
        <NavItem to="/admin/verification" icon={<CheckCircle size={18} />} label="Verification" collapsed={collapsed} />
        <NavItem to="/admin/matches" icon={<Heart size={18} />} label="Matches" collapsed={collapsed} />
        <NavItem to="/admin/messages" icon={<MessageSquare size={18} />} label="Messages" collapsed={collapsed} />
        <NavItem to="/admin/swipes" icon={<ArrowRightLeft size={18} />} label="Swipes" collapsed={collapsed} />
        <NavItem to="/admin/bans" icon={<Ban size={18} />} label="Bans" collapsed={collapsed} />
        <NavItem to="/admin/analytics" icon={<Activity size={18} />} label="Analytics" collapsed={collapsed} />        <SidebarSection title="Advanced" collapsed={collapsed} />
        <NavItem to="/admin/billing" icon={<CreditCard size={18} />} label="Billing" collapsed={collapsed} />
        <NavItem to="/admin/notifications" icon={<Bell size={18} />} label="Notifications" collapsed={collapsed} />
        <NavItem to="/admin/system-status" icon={<Activity size={18} />} label="System Status" collapsed={collapsed} />
        <NavItem to="/admin/integrations" icon={<Link2 size={18} />} label="Integrations" collapsed={collapsed} />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group relative flex items-center justify-between
        px-4 py-3 rounded-xl
        transition-all duration-200

        ${
          isActive
            ? "bg-gold/10 text-gold"
            : "text-gray-400 hover:text-white hover:bg-[#1a1a20]"
        }
      `
      }
    >
      <div className="flex items-center gap-3">
        <span className="opacity-80 group-hover:opacity-100 transition">
          {icon}
        </span>

        {!collapsed && (
          <span className="text-sm font-medium tracking-wide">
            {label}
          </span>
        )}
      </div>

      {!collapsed && (
        <ChevronRight
          size={16}
          className="opacity-0 group-hover:opacity-50 transition"
        />
      )}

      {/* Gold Active Indicator Bar */}
      <div className="absolute left-0 top-2 bottom-2 w-1 bg-gold rounded-r opacity-0 group-[.active]:opacity-100" />
    </NavLink>
  );
}

function SidebarSection({ title, collapsed }: SidebarSectionProps) {
  if (collapsed) return null;

  return (
    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
      {title}
    </div>
  );
}