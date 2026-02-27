import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { ReactNode } from "react";

export default function RequireOnboarding({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
