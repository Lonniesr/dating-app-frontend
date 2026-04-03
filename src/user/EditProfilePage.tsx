import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import DeleteAccountSection from "./settings/DeleteAccountSection";

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
  const [onlyVerified, setOnlyVerified] = useState(false);

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

    setOnlyVerified(authUser.preferences?.onlyVerified ?? false);

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

  const updatePrompt = (index: number, field: keyof PromptItem, value: string) => {
    const updated = [...prompts];
    updated[index][field] = value;
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
          onlyVerified,
        },
        prompts,
      });

      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

    } catch (err: any) {
      console.error(err);
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto pb-28">

      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {saved && <div className="text-green-400 mb-4">Saved ✓</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}

      {/* NAME */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full mb-3 p-3 rounded bg-black/40"
      />

      {/* BIO */}
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
        className="w-full mb-3 p-3 rounded bg-black/40"
      />

      {/* GENDER */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full mb-3 p-3 rounded bg-black/40"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {/* PREFERENCES */}
      <div className="bg-white/5 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Dating Preferences</h2>

        <input
          value={interestedIn}
          onChange={(e) => setInterestedIn(e.target.value)}
          placeholder="Interested In"
          className="w-full mb-2 p-2 bg-black/40 rounded"
        />

        <input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(Number(e.target.value))}
          className="w-full mb-2 p-2 bg-black/40 rounded"
        />

        <input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(Number(e.target.value))}
          className="w-full mb-2 p-2 bg-black/40 rounded"
        />

        {/* NEW TOGGLES */}
        <label className="flex gap-2 mt-2">
          <input
            type="checkbox"
            checked={anywhere}
            onChange={(e) => setAnywhere(e.target.checked)}
          />
          Any location
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
          />
          Only verified users
        </label>
      </div>

      {/* PROMPTS */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Prompts</h2>

        {prompts.map((p, i) => (
          <div key={i} className="mb-2">
            <input
              value={p.question}
              onChange={(e) => updatePrompt(i, "question", e.target.value)}
              placeholder="Question"
              className="w-full mb-1 p-2 bg-black/40 rounded"
            />
            <input
              value={p.answer}
              onChange={(e) => updatePrompt(i, "answer", e.target.value)}
              placeholder="Answer"
              className="w-full p-2 bg-black/40 rounded"
            />
            <button onClick={() => removePrompt(i)}>Remove</button>
          </div>
        ))}

        <button onClick={addPrompt}>Add Prompt</button>
      </div>

      {/* SAVE */}
      <button
        onClick={saveProfile}
        className="w-full bg-yellow-500 p-3 rounded"
      >
        Save Changes
      </button>

      <DeleteAccountSection />

    </div>
  );
}