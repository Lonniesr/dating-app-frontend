import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import type { ReactNode } from "react";

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  /* =========================
     STILL LOADING AUTH
  ========================= */

  if (isLoading) {
    return null;
  }

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!authUser) {
    return <Navigate to="/signup" replace />;
  }

  /* =========================
     ADMINS BYPASS ONBOARDING
  ========================= */

  if (authUser.role === "admin") {
    return <>{children}</>;
  }

  /* =========================
     STEP DETECTION
  ========================= */

  if (!authUser.onboardingComplete) {
    // Step 1: Basic profile
    if (!authUser.name || !authUser.birthdate || !authUser.gender) {
      return <Navigate to="/invite/onboarding/basic" replace />;
    }

    // Step 2: Preferences
    if (!authUser.preferences) {
      return <Navigate to="/invite/onboarding/preferences" replace />;
    }

    // Step 3: Photos
    if (!authUser.photos || authUser.photos.length === 0) {
      return <Navigate to="/invite/onboarding/photos" replace />;
    }

    // Step 4: Personality prompts
    if (!authUser.prompts || Object.keys(authUser.prompts).length === 0) {
      return <Navigate to="/invite/onboarding/personality" replace />;
    }

    // Last step: Completion
    return <Navigate to="/invite/onboarding/complete" replace />;
  }

  /* =========================
     FULLY ONBOARDED
  ========================= */

  return <>{children}</>;
}