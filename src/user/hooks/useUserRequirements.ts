import { useUserAuth } from "../context/UserAuthContext";

export function useUserRequirements() {
  const { authUser } = useUserAuth();

  // Invite is validated by backend when user hits invite landing page
  const invited = !!authUser; // If user exists, invite was valid

  // Onboarding completion
  const onboardingComplete = !!authUser?.onboardingComplete;

  // Approval status
  const approved = authUser?.status === "approved";

  // Admin check
  const admin = authUser?.role === "admin";

  return {
    invited,
    onboardingComplete,
    approved,
    admin,
  };
}
