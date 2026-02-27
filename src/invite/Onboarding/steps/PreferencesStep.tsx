import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PreferencesStepProps {
  next: () => void;
  back: () => void;
}

export default function PreferencesStep({
  next,
  back,
}: PreferencesStepProps) {
  const queryClient = useQueryClient();

  const [interestedIn, setInterestedIn] = useState<string>("");
  const [racePreference, setRacePreference] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(35);

  // null = Any distance
  const [locationRadius, setLocationRadius] = useState<number | null>(25);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);

    if (!interestedIn) {
      setError("Please select who you're interested in.");
      return;
    }

    if (minAge >= maxAge) {
      setError("Minimum age must be less than maximum age.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/preferences`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences: {
              interestedIn,
              racePreference: racePreference || null,
              minAge,
              maxAge,
              locationRadius, // null = unlimited
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      next();
    } catch (err) {
      console.error("Preferences error:", err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dating Preferences</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Interested In */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Interested In</label>
        <select
          value={interestedIn}
          onChange={(e) => setInterestedIn(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">Select...</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Everyone">Everyone</option>
        </select>
      </div>

      {/* Race Preference */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Race Preference (optional)
        </label>
        <select
          value={racePreference}
          onChange={(e) => setRacePreference(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">No Preference</option>
          <option value="White">White</option>
          <option value="Black">Black</option>
          <option value="Asian">Asian</option>
          <option value="Latino">Latino</option>
          <option value="Middle Eastern">Middle Eastern</option>
          <option value="Mixed">Mixed</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Age Range */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Age Range</label>
        <div className="flex gap-3">
          <input
            type="number"
            min={18}
            max={100}
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="w-1/2 p-3 rounded-lg bg-zinc-900 text-white border border-white/20"
          />
          <input
            type="number"
            min={18}
            max={100}
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-1/2 p-3 rounded-lg bg-zinc-900 text-white border border-white/20"
          />
        </div>
      </div>

      {/* Location Radius */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Location Radius:{" "}
          {locationRadius === null
            ? "Any distance"
            : `${locationRadius} miles`}
        </label>

        <select
          value={locationRadius ?? "any"}
          onChange={(e) =>
            setLocationRadius(
              e.target.value === "any"
                ? null
                : Number(e.target.value)
            )
          }
          className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="any">Any distance</option>
          <option value={5}>5 miles</option>
          <option value={10}>10 miles</option>
          <option value={25}>25 miles</option>
          <option value={50}>50 miles</option>
          <option value={100}>100 miles</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg"
        >
          Back
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}