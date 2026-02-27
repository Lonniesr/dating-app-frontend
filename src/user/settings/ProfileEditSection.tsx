import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

export default function ProfileEditSection() {
  const { updateProfile } = useSettings();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const isLoading = updateProfile.isPending;

  const handleSave = () => {
    const trimmed = name.trim();

    if (!trimmed) {
      toast.error("Name cannot be empty");
      return;
    }

    if (trimmed.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (bio.length > 300) {
      toast.error("Bio cannot exceed 300 characters");
      return;
    }

    updateProfile.mutate(
      { name: trimmed, bio },
      {
        onSuccess: () => {
          toast.success("Profile updated");
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

  return (
    <section className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4">
      <h2 className="text-2xl font-semibold">Profile</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 bg-black border border-white/20 rounded-lg focus:border-yellow-500 outline-none transition"
      />

      <textarea
        placeholder="Your bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-3 bg-black border border-white/20 rounded-lg min-h-[120px] focus:border-yellow-500 outline-none transition"
      />

      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed text-gray-300"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </section>
  );
}
