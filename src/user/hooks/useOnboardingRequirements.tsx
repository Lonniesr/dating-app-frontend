import { useUserAuth } from "../context/UserAuthContext";
import type { ReactNode } from "react";

/*
=====================================
Legacy Onboarding Guard (Disabled)
=====================================

This file previously enforced onboarding redirects.
The application now uses ProtectedRoute + getOnboardingStep()
for onboarding logic.

To prevent conflicting redirects and flickering navigation,
this guard now simply ensures authentication is loaded
and allows rendering.

If onboarding enforcement is needed, it should happen
in ProtectedRoute.tsx.
*/

export default function RequireOnboarding({
  children,
}: {
  children: ReactNode;
}) {
  const { authUser, isLoading } = useUserAuth();

  /* WAIT FOR AUTH */

  if (isLoading) {
    return null;
  }

  /* NOT LOGGED IN */

  if (!authUser) {
    return null;
  }

  /* ALLOW RENDER */

  return <>{children}</>;
}