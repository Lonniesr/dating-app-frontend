// src/admin/core/NavConfig.ts
import {
  Home,
  Users,
  Search,
  Shield,
  Settings,
  UserCheck,
  Mail,
  MessageSquare,
  Shuffle,
  Ban,
  FileText,
  CreditCard,
  Bell,
  Activity,
  Plug,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  to: string;
  icon?: any;
  roles?: string[];
  breadcrumb?: string;
}

export interface AdminNavSection {
  section: string;
  collapsible?: boolean;
  items: AdminNavItem[];
}

export const adminNav: AdminNavSection[] = [
  {
    section: "Overview",
    collapsible: false,
    items: [
      {
        label: "Dashboard",
        to: "/admin",
        icon: Home,
        breadcrumb: "Dashboard",
      },
    ],
  },

  {
    section: "Management",
    collapsible: true,
    items: [
      { label: "Users", to: "/admin/users", icon: Users, breadcrumb: "Users" },
      { label: "User Search", to: "/admin/search", icon: Search, breadcrumb: "Search" },
      { label: "Roles", to: "/admin/roles", icon: Shield, breadcrumb: "Roles", roles: ["superadmin"] },
      { label: "Admins", to: "/admin/admins", icon: UserCheck, breadcrumb: "Admins", roles: ["superadmin"] },
      { label: "Invites", to: "/admin/invites", icon: Mail, breadcrumb: "Invites" },
      { label: "Verification", to: "/admin/verification", icon: Shield, breadcrumb: "Verification" },
      { label: "Matches", to: "/admin/matches", icon: Shuffle, breadcrumb: "Matches" },
      { label: "Messages", to: "/admin/messages", icon: MessageSquare, breadcrumb: "Messages" },
      { label: "Swipes", to: "/admin/swipes", icon: Shuffle, breadcrumb: "Swipes" },
      { label: "Bans", to: "/admin/bans", icon: Ban, breadcrumb: "Bans" },
      { label: "Notes", to: "/admin/notes", icon: FileText, breadcrumb: "Notes" },
    ],
  },

  {
    section: "System",
    collapsible: true,
    items: [
      { label: "Settings", to: "/admin/settings", icon: Settings, breadcrumb: "Settings" },
      { label: "Billing", to: "/admin/billing", icon: CreditCard, breadcrumb: "Billing", roles: ["superadmin"] },
      { label: "Notifications", to: "/admin/notifications", icon: Bell, breadcrumb: "Notifications" },
      { label: "System Status", to: "/admin/system-status", icon: Activity, breadcrumb: "System Status" },
      { label: "Integrations", to: "/admin/integrations", icon: Plug, breadcrumb: "Integrations", roles: ["superadmin"] },
    ],
  },
];
