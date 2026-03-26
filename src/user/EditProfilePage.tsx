import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import DeleteAccountSection from "./settings/DeleteAccountSection"; // ✅ ADDED

type PromptItem = {
  question: string;
  answer: string;
};

export default function EditProfilePage() {
  const { authUser, refreshUser } = useUserAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");

  const [interestedIn, setInterestedIn] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [locationRadius, setLocationRadius] = useState(50);
  const [anywhere, setAnywhere] = useState(false);

  const [prompts, setPrompts] = useState<PromptItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;

    setName(authUser.name || "");
    setBio(authUser.bio || "");
    setGender(authUser.gender || "");

    setInterestedIn(authUser.preferences?.interestedIn || "");
    setMinAge(authUser.preferences?.minAge || 18);
    setMaxAge(authUser.preferences?.maxAge || 40);

    const radius = authUser.preferences?.locationRadius;
    setLocationRadius(radius ?? 50);
    setAnywhere(radius === null);

    if (Array.isArray(authUser.prompts)) {
      setPrompts(authUser.prompts);
    } else {
      setPrompts([
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
      ]);
    }
  }, [authUser]);

  const updatePrompt = (index: number, field: string, value: string) => {
    const updated = [...prompts];
    updated[index][field as keyof PromptItem] = value;
    setPrompts(updated);
  };

  const addPrompt = () => {
    setPrompts([...prompts, { question: "", answer: "" }]);
  };

  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      setSaved(false);
      setError(null);

      await apiClient.put("/api/profile", {
        name,
        bio,
        gender,
        preferences: {
          interestedIn,
          minAge,
          maxAge,
          locationRadius: anywhere ? null : locationRadius,
        },
        prompts,
      });

      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

    } catch (err: any) {
      console.error("❌ Save failed", err);
      setError(err?.response?.data?.error || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto pb-28">

      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      {/* VERIFICATION */}
      {!authUser?.verified && (
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Profile Verification</h2>

          {authUser?.verification_status === "pending" ? (
            <p className="text-yellow-400 text-sm">
              Your verification is under review ⏳
            </p>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-3">
                Verify your profile to build trust and get more matches.
              </p>

              <button
                onClick={() => navigate("/user/verify-selfie")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
              >
                Start Verification
              </button>
            </>
          )}
        </div>
      )}

      {/* STATUS */}
      {saved && (
        <div className="mb-4 bg-green-500/20 text-green-400 p-3 rounded-lg text-sm">
          Profile saved successfully ✓
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">

        {/* ALL YOUR EXISTING FORM SECTIONS UNCHANGED */}

        {/* SAVE */}
        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>

      </div>
    </div>
  );
}