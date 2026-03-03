import { Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminUserDetail from "../pages/AdminUserDetail";
import AdminRoles from "../pages/AdminRoles";
import AdminSettings from "../pages/AdminSettings";
import AdminInvites from "../pages/AdminInvites";
import AdminVerification from "../pages/AdminVerification";
import AdminMatches from "../pages/AdminMatches";
import AdminMessages from "../pages/AdminMessages";
import AdminSwipes from "../pages/AdminSwipes";
import AdminBans from "../pages/AdminBans";
import AdminUserSearchPage from "../pages/AdminUserSearchPage";
import AdminBillingPage from "../pages/AdminBillingPage";
import AdminNotificationsPage from "../pages/AdminNotificationsPage";
import AdminSystemStatusPage from "../pages/AdminSystemStatusPage";
import AdminIntegrationsPage from "../pages/AdminIntegrationsPage";
import AdminProfile from "../pages/AdminProfile";
import AdminReportsPage from "../pages/AdminReportsPage";
import AdminSupport from "../pages/AdminSupport";
import AdminAnalyticsDeepDivePage from "../pages/AdminAnalyticsDeepDivePage";
import AdminSystemLogsPage from "../pages/AdminSystemLogsPage";

export default function AdminRoutes() {
  return (
    <>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/:id" element={<AdminUserDetail />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="invites" element={<AdminInvites />} />
      <Route path="verification" element={<AdminVerification />} />
      <Route path="matches" element={<AdminMatches />} />
      <Route path="messages" element={<AdminMessages />} />
      <Route path="swipes" element={<AdminSwipes />} />
      <Route path="bans" element={<AdminBans />} />
      <Route path="search" element={<AdminUserSearchPage />} />
      <Route path="billing" element={<AdminBillingPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="system-status" element={<AdminSystemStatusPage />} />
      <Route path="integrations" element={<AdminIntegrationsPage />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="reports" element={<AdminReportsPage />} />
      <Route path="support" element={<AdminSupport />} />
      <Route path="analytics" element={<AdminAnalyticsDeepDivePage />} />
      <Route path="system-logs" element={<AdminSystemLogsPage />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </>
  );
}