// src/invite/Onboarding/index.tsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../user/context/UserAuthContext";

import BasicStep from "./steps/BasicStep";
import PhotosStep from "./steps/PhotosStep";
import PreferencesStep from "./steps/PreferencesStep";
import PersonalityStep from "./steps/PersonalityStep";

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authUser } = useUserAuth();

  const [step, setStep] = useState(0);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const hasInitialized = useRef(false); // 🔥 CRITICAL FIX

  const totalSteps = 4;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  /* ================================
     Invite Code
  ================================= */

  useEffect(() => {
    const code = searchParams.get("invite");
    if (code) setInviteCode(code);
  }, [searchParams]);

  /* ================================
     Smart Resume (RUN ONCE ONLY)
  ================================= */

  useEffect(() => {
    if (!authUser || hasInitialized.current) return;

    console.log("🧠 SETTING INITIAL STEP");

    const hasBasic =
      Boolean(authUser.name?.trim()) &&
      Boolean(authUser.birthdate) &&
      Boolean(authUser.gender) &&
      Boolean(authUser.race);

    const hasPhotos =
      Array.isArray(authUser.photos) &&
      authUser.photos.length > 0;

    const hasPreferences =
      authUser.preferences &&
      authUser.preferences.interestedIn &&
      authUser.preferences.minAge &&
      authUser.preferences.maxAge;

    const hasPrompts =
      authUser.prompts &&
      Object.keys(authUser.prompts).length > 0;

    if (!hasBasic) setStep(0);
    else if (!hasPhotos) setStep(1);
    else if (!hasPreferences) setStep(2);
    else if (!hasPrompts) setStep(3);
    else navigate("/user/dashboard");

    hasInitialized.current = true; // 🔥 LOCK IT FOREVER
  }, [authUser, navigate]);

  /* ================================
     Navigation
  ================================= */

  const goNext = () => {
    console.log("➡️ NEXT CLICKED");
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    console.log("⬅️ BACK CLICKED");
    setStep((prev) => prev - 1);
  };

  /* ================================
     Finish
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

      {/* Progress */}

      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}

      <div>
        {step === 0 && <BasicStep next={goNext} />}
        {step === 1 && <PhotosStep next={goNext} back={goBack} />}
        {step === 2 && <PreferencesStep next={goNext} back={goBack} />}
        {step === 3 && <PersonalityStep next={finish} back={goBack} />}
      </div>

    </div>
  );
}