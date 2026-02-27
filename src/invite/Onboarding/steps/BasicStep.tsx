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
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${(import.meta as any).env.VITE_API_URL}/api/onboarding/basic`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, birthdate, gender }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to save.");
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["authUser"],
    });

    next(); // ← move to next step
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Basic Information</h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        className="w-full p-3 mb-3 rounded bg-white/10 text-white border border-white/20"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-3 mb-3 rounded bg-white/10 text-white border border-white/20"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />

      <select
        className="w-full p-3 mb-3 rounded bg-white/10 text-white border border-white/20 focus:border-yellow-500"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="" className="text-black">Select gender</option>
        <option value="male" className="text-black">♂ Male</option>
        <option value="female" className="text-black">♀ Female</option>
        <option value="other" className="text-black">⚧ Other</option>
      </select>

      <button
        onClick={submit}
        className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold"
      >
        Continue
      </button>
    </div>
  );
}
