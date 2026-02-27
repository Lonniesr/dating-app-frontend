// src/user/settings/PreferencesSection.tsx

import { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const API = import.meta.env.VITE_API_URL;

export default function PreferencesSection() {
  const { authUser, refreshUser } = useUserAuth();
  const existing = authUser?.preferences;

  const [interestedIn, setInterestedIn] = useState(
    existing?.interestedIn || ""
  );
  const [minAge, setMinAge] = useState(existing?.minAge || 25);
  const [maxAge, setMaxAge] = useState(existing?.maxAge || 40);
  const [racePreference, setRacePreference] = useState(
    existing?.racePreference || ""
  );
  const [locationRadius, setLocationRadius] = useState<
    number | "any"
  >(existing?.locationRadius ?? "any");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API}/api/user/preferences`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestedIn,
          minAge,
          maxAge,
          racePreference: racePreference || null,
          locationRadius:
            locationRadius === "any" ? null : locationRadius,
        }),
      });

      if (!res.ok) throw new Error();

      await refreshUser();
      setMessage("Preferences updated.");
    } catch {
      setMessage("Failed to save preferences.");
    }

    setLoading(false);
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Dating Preferences
      </h2>

      {message && (
        <p className="text-sm text-green-400">{message}</p>
      )}

      <div className="space-y-4">

        <div>
          <label className="block text-sm text-white/60 mb-1">
            Interested In
          </label>
          <select
            value={interestedIn}
            onChange={(e) => setInterestedIn(e.target.value)}
            className="w-full p-3 rounded bg-white/10"
          >
            <option value="">Select</option>
            <option>Men</option>
            <option>Women</option>
            <option>Everyone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">
            Age Range
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-1/2 p-3 rounded bg-white/10"
            />
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-1/2 p-3 rounded bg-white/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">
            Race Preference
          </label>
          <select
            value={racePreference}
            onChange={(e) => setRacePreference(e.target.value)}
            className="w-full p-3 rounded bg-white/10"
          >
            <option value="">No preference</option>
            <option>Black</option>
            <option>White</option>
            <option>Asian</option>
            <option>Latino</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1">
            Distance
          </label>
          <select
            value={locationRadius}
            onChange={(e) =>
              setLocationRadius(
                e.target.value === "any"
                  ? "any"
                  : Number(e.target.value)
              )
            }
            className="w-full p-3 rounded bg-white/10"
          >
            <option value="any">Any location</option>
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
          </select>
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="w-full py-3 bg-[#d4af37] text-black rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </section>
  );
}