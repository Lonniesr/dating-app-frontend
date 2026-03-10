import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
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

  if (authUser.role === "admin") {
    return <>{children}</>;
  }

  if (!authUser.onboardingComplete) {
    const hasBasic =
      !!authUser.name &&
      !!authUser.birthdate &&
      !!authUser.gender;

    const hasPreferences =
      authUser.preferences &&
      Object.keys(authUser.preferences).length > 0;

    const hasPhotos =
      Array.isArray(authUser.photos) &&
      authUser.photos.length > 0;

    const hasPrompts =
      authUser.prompts &&
      Object.keys(authUser.prompts).length > 0;

    if (!hasBasic) {
      return <Navigate to="/invite/onboarding/basic" replace />;
    }

    if (!hasPreferences) {
      return <Navigate to="/invite/onboarding/preferences" replace />;
    }

    if (!hasPhotos) {
      return <Navigate to="/invite/onboarding/photos" replace />;
    }

    if (!hasPrompts) {
      return <Navigate to="/invite/onboarding/personality" replace />;
    }

    return <Navigate to="/invite/onboarding/complete" replace />;
  }

  return <>{children}</>;
}