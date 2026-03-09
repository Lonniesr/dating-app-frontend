import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface BasicStepProps {
  next: () => void;
}

export default function BasicStep({ next }: BasicStepProps) {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");

  const [birthplace, setBirthplace] = useState("");
  const [bio, setBio] = useState("");

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

  const getLocation = () =>
    new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        reject
      );
    });

  const submit = async () => {
    setError(null);

    if (!name || !birthdate || !gender || !race) {
      setError("All required fields must be filled.");
      return;
    }

    const age = calculateAge(birthdate);

    if (age < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

    setLoading(true);

    try {
      const location = await getLocation();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/basic`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            birthdate,
            gender,
            race,
            bio: bio.trim(),
            birthplace: birthplace.trim(),
            latitude: location.lat,
            longitude: location.lon,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save.");
        setLoading(false);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      next();
    } catch (err) {
      console.error("Basic step error:", err);
      setError("Location permission is required.");
    }

    setLoading(false);
  };

  const nextStep = () => {
    setError(null);

    if (step === 1) {
      if (!name || !birthdate) {
        setError("Please enter your name and birthdate.");
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

      {/* STEP 1 */}

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="mb-6">
            <label className="block text-sm text-white/60 mb-1">
              Birthdate
            </label>

            <input
              type="date"
              style={{ colorScheme: "dark" }}
              className={`w-full p-3 rounded bg-white/10 border border-white/20 focus:border-yellow-500 outline-none ${
                birthdate ? "text-white" : "text-white/40"
              }`}
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        </>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <>
          <select
            className="w-full p-3 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" className="text-black">
              Select gender
            </option>
            <option value="male" className="text-black">♂ Male</option>
            <option value="female" className="text-black">♀ Female</option>
            <option value="other" className="text-black">⚧ Other</option>
          </select>

          <select
            className="w-full p-3 mb-6 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            <option value="" className="text-black">Select race</option>
            <option value="Black" className="text-black">Black</option>
            <option value="White" className="text-black">White</option>
            <option value="Asian" className="text-black">Asian</option>
            <option value="Latino" className="text-black">Latino</option>
            <option value="Middle Eastern" className="text-black">Middle Eastern</option>
            <option value="Mixed" className="text-black">Mixed</option>
            <option value="Other" className="text-black">Other</option>
          </select>
        </>
      )}

      {/* STEP 3 */}

      {step === 3 && (
        <>
          <input
            type="text"
            placeholder="Where are you from?"
            className="w-full p-3 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
            value={birthplace}
            onChange={(e) => setBirthplace(e.target.value)}
          />

          <textarea
            placeholder="Tell people a little about yourself..."
            maxLength={300}
            className="w-full p-3 mb-2 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none h-28 resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="text-right text-xs text-white/40 mb-6">
            {bio.length} / 300
          </div>
        </>
      )}

      {/* NAVIGATION BUTTONS */}

      <div className="flex gap-3">

        {step > 1 && (
          <button
            onClick={prevStep}
            className="w-full py-3 bg-white/10 rounded-lg font-semibold"
          >
            Back
          </button>
        )}

        {step < 3 && (
          <button
            onClick={nextStep}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold"
          >
            Continue
          </button>
        )}

        {step === 3 && (
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish"}
          </button>
        )}

      </div>

    </div>
  );
}