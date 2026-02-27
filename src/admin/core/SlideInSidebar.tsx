import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./sidebar.css";

export default function SlideInSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-scroll">

        {/* Collapse Toggle */}
        <div
          className="sidebar-item"
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginBottom: "12px", cursor: "pointer" }}
        >
          <span className="sidebar-icon">≡</span>
          <span className="sidebar-label">Collapse</span>
        </div>

        {/* Overview */}
        <SidebarSection title="Overview" />
        <NavItem to="/admin" icon="🏠" label="Dashboard" />

        {/* Users */}
        <SidebarSection title="Users" />
        <NavItem to="/admin/users" icon="👤" label="Users" />
        <NavItem to="/admin/search" icon="🔍" label="User Search" />

        {/* Admin Tools */}
        <SidebarSection title="Admin Tools" />
        {/* Removed AdminAdmins */}
        <NavItem to="/admin/roles" icon="🛡️" label="Roles" />

        {/* System */}
        <SidebarSection title="System" />
        <NavItem to="/admin/settings" icon="⚙️" label="Settings" />
        <NavItem to="/admin/invites" icon="✉️" label="Invites" />
        <NavItem to="/admin/verification" icon="✔️" label="Verification" />
        <NavItem to="/admin/matches" icon="❤️" label="Matches" />
        <NavItem to="/admin/messages" icon="💬" label="Messages" />
        <NavItem to="/admin/swipes" icon="➡️" label="Swipes" />
        <NavItem to="/admin/bans" icon="⛔" label="Bans" />
        <NavItem to="/admin/notes" icon="📝" label="Notes" />

        {/* Advanced */}
        <SidebarSection title="Advanced" />
        <NavItem to="/admin/billing" icon="💳" label="Billing" />
        <NavItem to="/admin/notifications" icon="🔔" label="Notifications" />
        <NavItem to="/admin/system-status" icon="📊" label="System Status" />
        <NavItem to="/admin/integrations" icon="🔗" label="Integrations" />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
      <span className="sidebar-arrow">›</span>
    </NavLink>
  );
}

function SidebarSection({ title }) {
  return <div className="sidebar-section-title">{title}</div>;
}
