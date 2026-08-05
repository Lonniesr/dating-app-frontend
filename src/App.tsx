import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RouteGuard from "./admin/core/RouteGuard";
import AdminLayout from "./admin/core/Layout";

const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/pages/AdminUsers"));
const AdminUserDetail = lazy(() => import("./admin/pages/AdminUserDetail"));
const AdminRoles = lazy(() => import("./admin/pages/AdminRoles"));
const AdminSettings = lazy(() => import("./admin/pages/AdminSettings"));
const AdminInvites = lazy(() => import("./admin/pages/AdminInvites"));
const AdminVerification = lazy(() => import("./admin/pages/AdminVerification"));
const AdminMatches = lazy(() => import("./admin/pages/AdminMatches"));
const AdminMessages = lazy(() => import("./admin/pages/AdminMessages"));
const AdminSwipes = lazy(() => import("./admin/pages/AdminSwipes"));
const AdminBans = lazy(() => import("./admin/pages/AdminBans"));
const AdminUserSearchPage = lazy(() => import("./admin/pages/AdminUserSearchPage"));
const AdminBillingPage = lazy(() => import("./admin/pages/AdminBillingPage"));
const AdminNotificationsPage = lazy(() => import("./admin/pages/AdminNotificationsPage"));
const AdminSystemStatusPage = lazy(() => import("./admin/pages/AdminSystemStatusPage"));
const AdminIntegrationsPage = lazy(() => import("./admin/pages/AdminIntegrationsPage"));
const AdminProfile = lazy(() => import("./admin/pages/AdminProfile"));
const AdminReportsPage = lazy(() => import("./admin/pages/AdminReportsPage"));
const AdminSupport = lazy(() => import("./admin/pages/AdminSupport"));
const AdminAnalyticsDeepDivePage = lazy(() => import("./admin/pages/AdminAnalyticsDeepDivePage"));
const AdminSystemLogsPage = lazy(() => import("./admin/pages/AdminSystemLogsPage"));
const CreatorStudio = lazy(() => import("./admin/pages/CreatorStudio"));

import LoginPage from "./user/LoginPage";
import ForgotPasswordPage from "./user/ForgotPasswordPage";
import ResetPasswordPage from "./user/ResetPasswordPage";

import DashboardPage from "./user/DashboardPage";
import ProfilePage from "./user/ProfilePage";
import SettingsPage from "./user/SettingsPage";
import MessagesPage from "./user/MessagesPage";
import MatchesPage from "./user/MatchesPage";
import EditProfilePage from "./user/EditProfilePage";
import DiscoverFeed from "./user/components/DiscoverFeed";
import LikesPage from "./user/LikesPage";
import ChatPage from "./user/ChatPage";

/* ✅ NEW */
import SelfieVerificationPage from "./user/SelfieVerificationPage";

/* ✅ ADDED */
import PhotoRequestsPage from "./user/PhotoRequestsPage";

import UserLayout from "./user/layout/UserLayout";
import ProtectedRoute from "./user/routes/ProtectedRoute";

import InviteLandingPage from "./invite/InviteLandingPage";
import OnboardingPage from "./invite/Onboarding";
import SignupPage from "./invite/Signup";

export default function App() {
  
  return (
  <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/invite/:code" element={<InviteLandingPage />} />

      <Route path="/invite/onboarding/*" element={<OnboardingPage />} />

      {/* PROTECTED USER AREA */}
      <Route element={<ProtectedRoute />}>

        <Route path="/user" element={<UserLayout />}>

          <Route index element={<Navigate to="discover" replace />} />

          <Route path="discover" element={<DiscoverFeed />} />
          <Route path="likes" element={<LikesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:id" element={<ProfilePage />} />

          <Route path="edit-profile" element={<EditProfilePage />} />

          <Route path="settings" element={<SettingsPage />} />

          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:id" element={<ChatPage />} />

          <Route path="matches" element={<MatchesPage />} />

          {/* ✅ NEW ROUTE */}
          <Route path="verify-selfie" element={<SelfieVerificationPage />} />

          {/* ✅ ADDED ROUTE */}
          <Route path="requests" element={<PhotoRequestsPage />} />

        </Route>

      </Route>

      {/* ADMIN */}
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
        <Route path="creator" element={<CreatorStudio />} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  </Suspense>
  );
}