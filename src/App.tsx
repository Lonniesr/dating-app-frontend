import { Routes, Route, Navigate } from "react-router-dom";

import RouteGuard from "./admin/core/RouteGuard";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/core/Layout";

// AUTH
import LoginPage from "./user/LoginPage";

// USER PAGES
import DashboardPage from "./user/DashboardPage";
import DiscoverPage from "./user/DiscoverPage";
import ProfilePage from "./user/ProfilePage";
import SettingsPage from "./user/SettingsPage";
import MessagesPage from "./user/MessagesPage";
import MatchesPage from "./user/MatchesPage";

// USER LAYOUT + GUARD
import UserLayout from "./user/layout/UserLayout";
import UserRouteGuard from "./user/guards/UserRouteGuard";

// INVITE FLOW
import InviteLandingPage from "./invite/InviteLandingPage";
import OnboardingPage from "./invite/Onboarding";
import SignupPage from "./invite/Signup";

export default function App() {
  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}

      <Route path="/invite/:code" element={<InviteLandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ---------------- USER AREA (PROTECTED) ---------------- */}

      <Route
        path="/user"
        element={
          <UserRouteGuard>
            <UserLayout />
          </UserRouteGuard>
        }
      >
        {/* Default /user → /user/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="matches" element={<MatchesPage />} />
      </Route>

      {/* ---------------- ONBOARDING (PROTECTED) ---------------- */}

      <Route
        path="/invite/onboarding"
        element={
          <UserRouteGuard>
            <OnboardingPage />
          </UserRouteGuard>
        }
      />

      {/* ---------------- ADMIN AREA ---------------- */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/*"
        element={
          <RouteGuard>
            <AdminLayout />
          </RouteGuard>
        }
      />

      {/* ---------------- FALLBACK ---------------- */}

      {/* If logged in and bad route, go to dashboard instead of login */}
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  );
}