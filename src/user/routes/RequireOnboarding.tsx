import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/useUserAuth";
import type { ReactNode } from "react";

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  // ⏳ Still loading auth state
  if (isLoading) {
    return null;
  }

  // 🔐 Not logged in
  if (!authUser) {
    return <Navigate to="/signup" replace />;
  }

  // 🛡 Admins bypass onboarding entirely
  if (authUser.role === "admin") {
    return <>{children}</>;
  }

  // 👤 Regular users must complete onboarding
  if (!authUser.onboardingComplete) {
    return <Navigate to="/invite/onboarding" replace />;
  }

  // ✅ Fully onboarded user
  return <>{children}</>;
}