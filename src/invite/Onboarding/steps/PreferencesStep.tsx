import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "../../../user/context/UserAuthContext";

interface PreferencesStepProps {
  next: () => void;
  back: () => void;
}

export default function PreferencesStep({
  next,
  back,
}: PreferencesStepProps) {
  const queryClient = useQueryClient();
  const { authUser, refreshUser } = useUserAuth();

  const [interestedIn, setInterestedIn] = useState("");
  const [racePreference, setRacePreference] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);

  const [locationRadius, setLocationRadius] = useState<number>(25);
  const [anyLocation, setAnyLocation] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD EXISTING PREFERENCES
  ========================= */

  useEffect(() => {
    if (!authUser?.preferences) return;

    const prefs = authUser.preferences;

    setInterestedIn(prefs.interestedIn ?? "");
    setRacePreference(prefs.racePreference ?? "");
    setMinAge(prefs.minAge ?? 18);
    setMaxAge(prefs.maxAge ?? 35);

    if (prefs.locationRadius === null) {
      setAnyLocation(true);
      setLocationRadius(25);
    } else {
      setAnyLocation(false);
      setLocationRadius(prefs.locationRadius ?? 25);
    }
  }, [authUser]);

  /* =========================
     SUBMIT
  ========================= */

  const submit = async () => {
    setError(null);

    if (!interestedIn) {
      setError("Please select who you're interested in.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`, // ✅ FIXED ENDPOINT
        {
          method: "PUT",
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
              locationRadius: anyLocation ? null : locationRadius, // 🔥 KEY FIX
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save preferences.");
        return;
      }

      await refreshUser();

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      next();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20"
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

      {/* Age */}

      <div className="mb-4">
        <label className="block mb-2 font-medium">Age Range</label>

        <div className="flex gap-3">
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="w-1/2 p-3 rounded-lg bg-white/10 border border-white/20"
          />

          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            className="w-1/2 p-3 rounded-lg bg-white/10 border border-white/20"
          />
        </div>
      </div>

      {/* 🔥 ANY LOCATION + RADIUS */}

      <div className="mb-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={anyLocation}
            onChange={(e) => setAnyLocation(e.target.checked)}
          />
          Any location
        </label>

        <input
          type="number"
          value={locationRadius}
          onChange={(e) => setLocationRadius(Number(e.target.value))}
          disabled={anyLocation}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 disabled:opacity-50"
          placeholder="Distance radius"
        />
      </div>

      {/* Buttons */}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg hover:bg-white/20"
        >
          Back
        </button>

        <button
          type="button"
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