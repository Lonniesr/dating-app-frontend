import { useState } from "react";

interface PhotosStepProps {
  next: () => void;
  back: () => void;
}

export default function PhotosStep({ next, back }: PhotosStepProps) {
  const [photos, setPhotos] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const updatePhoto = (i: number, value: string) => {
    const copy = [...photos];
    copy[i] = value;
    setPhotos(copy);
  };

  const addPhoto = () => setPhotos([...photos, ""]);

  const submit = async () => {
    setError(null);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/onboarding/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ photos }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to save.");
      return;
    }

    next();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Photos</h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      {photos.map((p, i) => (
        <input
          key={i}
          type="text"
          placeholder="Photo URL"
          className="w-full p-3 mb-3 rounded bg-white/10"
          value={p}
          onChange={(e) => updatePhoto(i, e.target.value)}
        />
      ))}

      <button
        onClick={addPhoto}
        className="w-full py-2 bg-white/10 rounded-lg mb-3"
      >
        Add Another Photo
      </button>

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg"
        >
          Back
        </button>

        <button
          onClick={submit}
          className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
