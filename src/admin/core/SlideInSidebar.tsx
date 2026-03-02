import { NavLink } from "react-router-dom";
import { useState } from "react";

interface NavItemProps {
  to: string;
  icon: string;
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
        ${collapsed ? "w-20" : "w-64"}
        transition-all duration-300
        bg-white border-r border-gray-200
        dark:bg-[#101012] dark:border-[#1E1E22]
        min-h-screen
      `}
    >
      <div className="h-full overflow-y-auto p-4 space-y-6">

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg
                     hover:bg-gray-100
                     dark:hover:bg-[#1A1A1E]
                     text-gold transition w-full"
        >
          <span>≡</span>
          {!collapsed && (
            <span className="text-sm font-medium">Collapse</span>
          )}
        </button>

        <SidebarSection title="Overview" collapsed={collapsed} />
        <NavItem to="/admin" icon="🏠" label="Dashboard" collapsed={collapsed} />

        <SidebarSection title="Users" collapsed={collapsed} />
        <NavItem to="/admin/users" icon="👤" label="Users" collapsed={collapsed} />
        <NavItem to="/admin/search" icon="🔍" label="User Search" collapsed={collapsed} />

        <SidebarSection title="Admin Tools" collapsed={collapsed} />
        <NavItem to="/admin/roles" icon="🛡️" label="Roles" collapsed={collapsed} />

        <SidebarSection title="System" collapsed={collapsed} />
        <NavItem to="/admin/settings" icon="⚙️" label="Settings" collapsed={collapsed} />
        <NavItem to="/admin/invites" icon="✉️" label="Invites" collapsed={collapsed} />
        <NavItem to="/admin/verification" icon="✔️" label="Verification" collapsed={collapsed} />
        <NavItem to="/admin/matches" icon="❤️" label="Matches" collapsed={collapsed} />
        <NavItem to="/admin/messages" icon="💬" label="Messages" collapsed={collapsed} />
        <NavItem to="/admin/swipes" icon="➡️" label="Swipes" collapsed={collapsed} />
        <NavItem to="/admin/bans" icon="⛔" label="Bans" collapsed={collapsed} />
        <NavItem to="/admin/notes" icon="📝" label="Notes" collapsed={collapsed} />

        <SidebarSection title="Advanced" collapsed={collapsed} />
        <NavItem to="/admin/billing" icon="💳" label="Billing" collapsed={collapsed} />
        <NavItem to="/admin/notifications" icon="🔔" label="Notifications" collapsed={collapsed} />
        <NavItem to="/admin/system-status" icon="📊" label="System Status" collapsed={collapsed} />
        <NavItem to="/admin/integrations" icon="🔗" label="Integrations" collapsed={collapsed} />
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
        group flex items-center justify-between
        px-3 py-2 rounded-lg
        transition-all duration-200

        ${
          isActive
            ? "bg-gold/10 text-gold border border-gold/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#1A1A1E] hover:text-gold"
        }
      `
      }
    >
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        {!collapsed && (
          <span className="text-sm font-medium tracking-tight">
            {label}
          </span>
        )}
      </div>

      {!collapsed && (
        <span className="opacity-40 group-hover:opacity-80">›</span>
      )}
    </NavLink>
  );
}

function SidebarSection({ title, collapsed }: SidebarSectionProps) {
  if (collapsed) return null;

  return (
    <div className="text-xs uppercase tracking-widest
                    text-gray-400 dark:text-gray-500 px-3">
      {title}
    </div>
  );
}