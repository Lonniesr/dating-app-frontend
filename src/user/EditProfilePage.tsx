import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import apiClient from "../services/apiClient";

type PromptItem = {
  question: string;
  answer: string;
};

export default function EditProfilePage() {
  const { authUser, refreshUser } = useUserAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");

  const [interestedIn, setInterestedIn] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [locationRadius, setLocationRadius] = useState(50);

  const [prompts, setPrompts] = useState<PromptItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     LOAD USER DATA
  =============================== */

  useEffect(() => {
    if (!authUser) return;

    setName(authUser.name || "");
    setBio(authUser.bio || "");
    setGender(authUser.gender || "");

    setInterestedIn(authUser.preferences?.interestedIn || "");
    setMinAge(authUser.preferences?.minAge || 18);
    setMaxAge(authUser.preferences?.maxAge || 40);
    setLocationRadius(authUser.preferences?.locationRadius ?? 50);

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

  /* ===============================
     PROMPT HANDLERS
  =============================== */

  const updatePrompt = (index: number, field: string, value: string) => {
    const updated = [...prompts];
    updated[index][field as keyof PromptItem] = value;
    setPrompts(updated);
  };

  const addPrompt = () => {
    setPrompts([...prompts, { question: "", answer: "" }]);
  };

  /* ===============================
     🚀 SAVE PROFILE (FIXED)
  =============================== */

  const saveProfile = async () => {
    try {
      setLoading(true);
      setSaved(false);
      setError(null);

      console.log("🚀 SENDING UPDATE...");

      const res = await apiClient.put("/api/profile", {
        name,
        bio,
        gender,
        preferences: {
          interestedIn,
          minAge,
          maxAge,
          locationRadius,
        },
        prompts,
      });

      console.log("✅ RESPONSE:", res.data);

      await refreshUser();

      setSaved(true);

      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      console.error("❌ Save failed", err);
      setError(
        err?.response?.data?.error || "Failed to save changes"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto pb-28">
      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      {/* SUCCESS / ERROR */}

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

      <div className="space-y-5">

        {/* NAME */}

        <div>
          <label className="text-sm text-white/70">Name</label>
          <input
            disabled
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white/50"
            value={name}
          />
        </div>

        {/* BIO */}

        <div>
          <label className="text-sm text-white/70">Bio</label>
          <textarea
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* GENDER */}

        <div>
          <label className="text-sm text-white/70">Gender</label>
          <select
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* PREFERENCES */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="font-semibold mb-4">
            Dating Preferences
          </h2>

          <div className="space-y-4">
            <select
              value={interestedIn}
              onChange={(e) => setInterestedIn(e.target.value)}
              className="w-full p-3 rounded bg-white/10 border border-white/20"
            >
              <option value="">Interested In</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Everyone">Everyone</option>
            </select>

            <div className="flex gap-3">
              <input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full p-3 rounded bg-white/10 border border-white/20"
              />
              <input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full p-3 rounded bg-white/10 border border-white/20"
              />
            </div>

            <input
              type="number"
              value={locationRadius}
              onChange={(e) =>
                setLocationRadius(Number(e.target.value))
              }
              className="w-full p-3 rounded bg-white/10 border border-white/20"
              placeholder="Distance radius"
            />
          </div>
        </div>

        {/* PROMPTS */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h2 className="font-semibold mb-4">
            Personality Prompts
          </h2>

          {prompts.map((p, i) => (
            <div key={i} className="mb-4">
              <input
                className="w-full bg-white/10 p-2 rounded mb-2"
                placeholder="Prompt question"
                value={p.question}
                onChange={(e) =>
                  updatePrompt(i, "question", e.target.value)
                }
              />
              <textarea
                className="w-full bg-white/10 p-2 rounded"
                placeholder="Your answer"
                value={p.answer}
                onChange={(e) =>
                  updatePrompt(i, "answer", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addPrompt}
            className="bg-gray-700 px-3 py-2 rounded"
          >
            Add Prompt
          </button>
        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>

      </div>
    </div>
  );
}