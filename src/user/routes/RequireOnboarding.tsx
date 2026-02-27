import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/useUserAuth";
import type { ReactNode } from "react";

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  if (isLoading) return null;

  if (!authUser) {
    return <Navigate to="/signup" replace />;
  }

  if (!authUser.onboardingComplete) {
    return <Navigate to="/invite/onboarding" replace />;
  }

  return children;
}