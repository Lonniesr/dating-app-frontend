import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface BasicStepProps {
  next: () => void;
}

export default function BasicStep({ next }: BasicStepProps) {

  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [birthdate, setBirthdate] = useState("");

  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");

  const [birthplace, setBirthplace] = useState("");
  const [bio, setBio] = useState("");

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAge = (dateString: string) => {

    const birth = new Date(dateString);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  /* =========================
     IP LOCATION FALLBACK
  ========================= */

  const getIPLocation = async () => {

    try {

      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const loc = {
        lat: data.latitude,
        lon: data.longitude
      };

      console.log("🌐 IP LOCATION:", loc);

      setLocation(loc);

    } catch (err) {

      console.error("IP location failed:", err);
      setError("Unable to determine your location.");

    }

  };

  /* =========================
     REQUEST LOCATION
  ========================= */

  const requestLocation = async () => {

    if (!navigator.geolocation) {
      await getIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };

        console.log("📍 GPS LOCATION:", loc);

        setLocation(loc);

      },

      async (err) => {

        console.warn("GPS denied, falling back to IP:", err);

        await getIPLocation();

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

  };

  /* =========================
     USERNAME CHECK
  ========================= */

  const checkUsername = async (value: string) => {

    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/check-username?username=${value}`
      );

      const data = await res.json();

      setUsernameAvailable(data.available);

    } catch (err) {

      console.error("Username check failed:", err);

    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const submit = async () => {

    setError(null);

    if (!username || !birthdate) {
      setError("Please enter a username and birthdate.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (usernameAvailable === false) {
      setError("Username already taken.");
      return;
    }

    const age = calculateAge(birthdate);

    if (age < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

    if (!gender || !race) {
      setError("Please select your gender and race.");
      return;
    }

    if (!location) {
      setError("Please enable location.");
      return;
    }

    setLoading(true);

    try {

      const payload = {
        username: username.trim(),
        birthdate,
        gender,
        race,
        bio: bio.trim() || null,
        birthplace: birthplace.trim() || null,
        latitude: location.lat,
        longitude: location.lon
      };

      console.log("🚨 BASIC STEP PAYLOAD:", payload);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/basic`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      console.log("🚨 SERVER RESPONSE:", data);

      if (!res.ok) {
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["authUser"]
      });

      next();

    } catch (err) {

      console.error("Basic step error:", err);
      setError("Failed to save onboarding.");

    }

    setLoading(false);
  };

  const nextStep = () => {

    setError(null);

    if (step === 1) {

      if (!username || !birthdate) {
        setError("Please enter a username and birthdate.");
        return;
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }

      if (usernameAvailable === false) {
        setError("Username already taken.");
        return;
      }

    }

    if (step === 2) {

      if (!gender || !race) {
        setError("Please select your gender and race.");
        return;
      }

    }

    setStep(step + 1);

  };

  const prevStep = () => {

    setError(null);
    setStep(step - 1);

  };

  return (

    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-xl">

      <h1 className="text-2xl font-bold mb-2">Basic Information</h1>

      <div className="text-xs text-white/40 mb-6">
        Step {step} of 3
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Choose a username"
            className="w-full p-3 mb-2 rounded bg-white/10 text-white border border-white/20"
            value={username}
            onChange={(e) => {

              let value = e.target.value.toLowerCase();
              value = value.replace(/[^a-z0-9_]/g, "");

              if (value.length > 20) return;

              setUsername(value);
              checkUsername(value);

            }}
          />

          <div className="mb-6">

            <label className="block text-sm text-white/60 mb-1">
              Birthdate
            </label>

            <input
              type="date"
              className="w-full p-3 rounded bg-white/10 border border-white/20"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />

          </div>
        </>
      )}

      {step === 2 && (
        <>
          <select
            className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            <option value="">Select race</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Asian">Asian</option>
            <option value="Latino">Latino</option>
            <option value="Middle Eastern">Middle Eastern</option>
            <option value="Mixed">Mixed</option>
            <option value="Other">Other</option>
          </select>
        </>
      )}

      {step === 3 && (
        <>
          <button
            onClick={requestLocation}
            className="w-full py-3 mb-4 bg-blue-500 text-white rounded-lg font-semibold"
          >
            Enable Location
          </button>

          {location && (
            <div className="text-green-400 text-sm mb-4">
              ✓ Location enabled
            </div>
          )}

          <input
            type="text"
            placeholder="Where are you from?"
            className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20"
            value={birthplace}
            onChange={(e) => setBirthplace(e.target.value)}
          />

          <textarea
            placeholder="Tell people about yourself..."
            maxLength={300}
            className="w-full p-3 mb-2 rounded bg-white/10 border border-white/20 h-28 resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </>
      )}

      <div className="flex gap-3">

        {step > 1 && (
          <button
            onClick={prevStep}
            className="w-full py-3 bg-white/10 rounded-lg"
          >
            Back
          </button>
        )}

        {step < 3 && (
          <button
            onClick={nextStep}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg"
          >
            Continue
          </button>
        )}

        {step === 3 && (
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg"
          >
            {loading ? "Saving..." : "Finish"}
          </button>
        )}

      </div>

    </div>
  );
}