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
  const [locationRadius, setLocationRadius] = useState<number | null>(25);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);

    if (!interestedIn) {
      setError("Please select who you're interested in.");
      return;
    }

    if (minAge < 18) {
      setError("Minimum age must be at least 18.");
      return;
    }

    if (maxAge > 100) {
      setError("Maximum age cannot exceed 100.");
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
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-xl text-white">
      <h1 className="text-2xl font-bold mb-6">Dating Preferences</h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Interested In */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Interested In</label>
        <select
          value={interestedIn}
          onChange={(e) => setInterestedIn(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="" className="text-black">
            Select...
          </option>
          <option value="Men" className="text-black">
            Men
          </option>
          <option value="Women" className="text-black">
            Women
          </option>
          <option value="Everyone" className="text-black">
            Everyone
          </option>
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
          className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="" className="text-black">
            No Preference
          </option>
          <option value="White" className="text-black">
            White
          </option>
          <option value="Black" className="text-black">
            Black
          </option>
          <option value="Asian" className="text-black">
            Asian
          </option>
          <option value="Latino" className="text-black">
            Latino
          </option>
          <option value="Middle Eastern" className="text-black">
            Middle Eastern
          </option>
          <option value="Mixed" className="text-black">
            Mixed
          </option>
          <option value="Other" className="text-black">
            Other
          </option>
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
            className="w-1/2 p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            min={18}
            max={100}
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-1/2 p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Location Radius */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Location Radius
        </label>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={locationRadius === null}
            onChange={(e) =>
              setLocationRadius(e.target.checked ? null : 25)
            }
            className="w-4 h-4"
          />
          <span className="text-sm text-white/80">
            No location limit
          </span>
        </div>

        {locationRadius !== null && (
          <select
            value={locationRadius}
            onChange={(e) =>
              setLocationRadius(Number(e.target.value))
            }
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value={5} className="text-black">
              5 miles
            </option>
            <option value={10} className="text-black">
              10 miles
            </option>
            <option value={25} className="text-black">
              25 miles
            </option>
            <option value={50} className="text-black">
              50 miles
            </option>
            <option value={100} className="text-black">
              100 miles
            </option>
          </select>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
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