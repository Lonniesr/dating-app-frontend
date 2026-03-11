import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import type { ReactNode } from "react";

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!authUser) {
    return <Navigate to="/signup" replace />;
  }

  if (authUser.role === "admin") {
    return <>{children}</>;
  }

  /* =========================
     ONBOARDING REQUIRED
  ========================= */

  if (!authUser.onboardingComplete) {
    if (location.pathname !== "/invite/onboarding") {
      return <Navigate to="/invite/onboarding" replace />;
    }
  }

  return <>{children}</>;
}