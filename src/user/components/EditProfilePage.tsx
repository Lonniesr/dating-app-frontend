import { useEffect, useState } from "react";
import { useEditProfile } from "../hooks/useEditProfile";

type EditProfileForm = {
  name: string;
  gender: string;
  preferences: string;
};

export default function EditProfilePage() {
  const { data, isLoading } = useEditProfile();
  const [form, setForm] = useState<EditProfileForm | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form once when data arrives
  useEffect(() => {
    if (data && !form) {
      setForm({
        name: data.name || "",
        gender: data.gender || "",
        preferences: data.preferences || "",
      });
    }
  }, [data, form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaving(true);

      await fetch(`${import.meta.env.VITE_API_URL}/api/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !form) {
    return <div className="text-white/60">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">Edit Profile</h1>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-white/60">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-yellow-500 outline-none transition"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 text-white/60">Gender</label>
          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-yellow-500 outline-none transition"
          />
        </div>

        {/* Preferences */}
        <div>
          <label className="block mb-1 text-white/60">Preferences</label>
          <textarea
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black border border-white/20 min-h-[120px] focus:border-yellow-500 outline-none transition"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
