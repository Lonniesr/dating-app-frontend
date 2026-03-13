import { Routes, Route, Navigate } from "react-router-dom";

import RouteGuard from "./admin/core/RouteGuard";
import AdminLayout from "./admin/core/Layout";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminUserDetail from "./admin/pages/AdminUserDetail";
import AdminRoles from "./admin/pages/AdminRoles";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminInvites from "./admin/pages/AdminInvites";
import AdminVerification from "./admin/pages/AdminVerification";
import AdminMatches from "./admin/pages/AdminMatches";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminSwipes from "./admin/pages/AdminSwipes";
import AdminBans from "./admin/pages/AdminBans";
import AdminUserSearchPage from "./admin/pages/AdminUserSearchPage";
import AdminBillingPage from "./admin/pages/AdminBillingPage";
import AdminNotificationsPage from "./admin/pages/AdminNotificationsPage";
import AdminSystemStatusPage from "./admin/pages/AdminSystemStatusPage";
import AdminIntegrationsPage from "./admin/pages/AdminIntegrationsPage";
import AdminProfile from "./admin/pages/AdminProfile";
import AdminReportsPage from "./admin/pages/AdminReportsPage";
import AdminSupport from "./admin/pages/AdminSupport";
import AdminAnalyticsDeepDivePage from "./admin/pages/AdminAnalyticsDeepDivePage";
import AdminSystemLogsPage from "./admin/pages/AdminSystemLogsPage";

import LoginPage from "./user/LoginPage";

import DashboardPage from "./user/DashboardPage";
import ProfilePage from "./user/ProfilePage";
import SettingsPage from "./user/SettingsPage";
import MessagesPage from "./user/MessagesPage";
import MatchesPage from "./user/MatchesPage";
import EditProfilePage from "./user/EditProfilePage";
import DiscoverFeed from "./user/components/DiscoverFeed";
import LikesPage from "./user/LikesPage";

import UserLayout from "./user/layout/UserLayout";
import ProtectedRoute from "./user/routes/ProtectedRoute";

import InviteLandingPage from "./invite/InviteLandingPage";
import OnboardingPage from "./invite/Onboarding";
import SignupPage from "./invite/Signup";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/invite/:code" element={<InviteLandingPage />} />

      {/* PROTECTED USER AREA */}

      <Route element={<ProtectedRoute />}>

        <Route path="/user" element={<UserLayout />}>

          <Route index element={<Navigate to="discover" replace />} />

          <Route path="discover" element={<DiscoverFeed />} />
          <Route path="likes" element={<LikesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Messages routes */}
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:matchId" element={<MessagesPage />} />

          <Route path="matches" element={<MatchesPage />} />

        </Route>

        <Route
          path="/invite/onboarding/*"
          element={<OnboardingPage />}
        />

      </Route>

      {/* ADMIN AREA */}

      <Route
        path="/admin"
        element={
          <RouteGuard>
            <AdminLayout />
          </RouteGuard>
        }
      >
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
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}