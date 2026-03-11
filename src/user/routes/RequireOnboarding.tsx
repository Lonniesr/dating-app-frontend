import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import type { ReactNode } from "react";

/*
=====================================
RequireOnboarding Guard
=====================================

Purpose:
• Prevent users from accessing protected routes
  until onboarding is complete.

Behavior:
1. Wait for auth to load
2. Redirect unauthenticated users to signup
3. Allow admins to bypass onboarding
4. Redirect unfinished onboarding users to onboarding
5. Allow fully onboarded users through
*/

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  /* =========================
     AUTH STILL LOADING
  ========================= */

  if (isLoading) {
    return null;
  }

  /* =========================
     NOT AUTHENTICATED
  ========================= */

  if (!authUser) {
    return <Navigate to="/signup" replace />;
  }

  /* =========================
     ADMIN BYPASS
  ========================= */

  if (authUser.role === "admin") {
    return <>{children}</>;
  }

  /* =========================
     ONBOARDING REQUIRED
  ========================= */

  if (!authUser.onboardingComplete) {
    return <Navigate to="/invite/onboarding" replace />;
  }

  /* =========================
     USER FULLY ONBOARDED
  ========================= */

  return <>{children}</>;
}