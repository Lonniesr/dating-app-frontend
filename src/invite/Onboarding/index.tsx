import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../user/context/UserAuthContext";

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
  const [initialized, setInitialized] = useState(false); // ✅ prevents remount resets

  const totalSteps = 4;
  const progressPercent = ((step + 1) / totalSteps) * 100;

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
     Smart Resume Logic (RUNS ONCE)
  ================================= */
  useEffect(() => {
    if (!authUser || initialized) return;

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

    setInitialized(true);
  }, [authUser, initialized, navigate]);

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
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteCode }),
        }
      );
    } catch (err) {
      console.error("Error completing onboarding:", err);
    }

    navigate("/user/dashboard");
  };

  /* ================================
     Render
  ================================= */
  return (
    <div className="max-w-xl mx-auto py-10 text-white px-4">

      {/* ===== Progress Bar ===== */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>
            Step {step + 1} of {totalSteps}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ===== Step Content ===== */}
      <div className="transition-all duration-300">
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
    </div>
  );
}