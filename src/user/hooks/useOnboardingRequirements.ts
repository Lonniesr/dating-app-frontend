// src/user/hooks/useOnboardingRequirements.ts
import { useUserAuth } from "../context/UserAuthContext";

export function useOnboardingRequirements() {
  const { authUser } = useUserAuth();

  // 1. Basic profile info must be present
  const profileComplete =
    !!authUser?.name &&
    !!authUser?.birthdate &&
    !!authUser?.gender;

  // 2. Gender preferences must be set
  const genderPreferencesComplete =
    !!authUser?.preferences;

  // 3. At least one photo must be uploaded
  const photoUploadComplete =
    (authUser?.photos?.length ?? 0) > 0;

  // 4. User must be 18+
  const adult = (() => {
    if (!authUser?.birthdate) return false;
    const birthYear = new Date(authUser.birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear >= 18;
  })();

  return {
    profileComplete,
    genderPreferencesComplete,
    photoUploadComplete,
    adult,
  };
}
