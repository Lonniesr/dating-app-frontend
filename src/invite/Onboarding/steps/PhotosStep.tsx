import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { compressImage } from "../../../lib/compressImage";

interface PhotosStepProps {
  next: () => void;
  back: () => void;
}

export default function PhotosStep({ next, back }: PhotosStepProps) {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      setError(null);

      // Optional compression (safe & lightweight)
      const compressed = await compressImage(file);

      setFiles((prev) => [...prev, compressed]);
    } catch (err) {
      console.error("Image processing error:", err);
      setError("Failed to process image.");
    }
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (files.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const filePath = `user-photos/${crypto.randomUUID()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      // Save photo URLs to backend
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/photos`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ photos: uploadedUrls }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save photos");
      }

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      next();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload photos.");
    }

    setUploading(false);
  };

  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-white/10">
      <h1 className="text-2xl font-bold mb-6">Upload Photos</h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        {files.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              className="rounded-lg object-cover h-28 w-full"
            />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={back}
          className="flex-1 py-3 bg-white/10 rounded-lg"
        >
          Back
        </button>

        <button
          onClick={uploadPhotos}
          disabled={uploading || files.length === 0}
          className="flex-1 py-3 bg-yellow-500 text-black rounded-lg font-semibold disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}