import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../user/context/useUserAuth";

import BasicStep from "./steps/BasicStep";
import PhotosStep from "./steps/PhotosStep";
import PreferencesStep from "./steps/PreferencesStep";
import PersonalityStep from "./steps/PersonalityStep";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authUser } = useUserAuth();

  const [step, setStep] = useState(0);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  /* ================================
     Grab invite code from URL
  ================================= */
  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  /* ================================
     Smart Resume Logic
  ================================= */
  useEffect(() => {
    if (!authUser) return;

    if (!authUser.birthdate) {
      setStep(0);
    } else if (!authUser.photos || authUser.photos.length === 0) {
      setStep(1);
    } else if (!authUser.preferences) {
      setStep(2);
    } else if (!authUser.prompts) {
      setStep(3);
    } else {
      navigate("/user/dashboard");
    }
  }, [authUser, navigate]);

  /* ================================
     Navigation Helpers
  ================================= */
  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  /* ================================
     Finish Onboarding
  ================================= */
  const finish = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
    } catch (err) {
      console.error("Error completing onboarding:", err);
    }

    navigate("/user/dashboard");
  };

  /* ================================
     Render
  ================================= */
  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      {step === 0 && <BasicStep next={goNext} />}

      {step === 1 && (
        <PhotosStep next={goNext} back={goBack} />
      )}

      {step === 2 && (
        <PreferencesStep next={goNext} back={goBack} />
      )}

      {step === 3 && (
        <PersonalityStep next={finish} back={goBack} />
      )}
    </div>
  );
}