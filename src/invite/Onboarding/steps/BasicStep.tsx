import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface BasicStepProps {
  next: () => void;
}

export default function BasicStep({ next }: BasicStepProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
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
      setError("All fields are required.");
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

  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10 shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Basic Information</h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500 outline-none"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />

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

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}