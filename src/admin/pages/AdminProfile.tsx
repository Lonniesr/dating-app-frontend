import { useEffect, useState } from "react";
import { adminMeService } from "../services/me.service";

export default function AdminProfile() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    try {
      setLoading(true);

      const res = await adminMeService.get();

      if (res?.success) {
        setAdmin(res.admin);
      } else {
        setError("Failed to load admin profile");
      }
    } catch (err) {
      setError("Server error loading profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await adminMeService.update(admin);

      if (res?.success) {
        setSuccess("Profile updated successfully");
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Server error updating profile");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: string, value: any) {
    setAdmin((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6 text-gold-400">
        Admin Profile
      </h1>

      {loading && <div className="text-neutral-400">Loading profile…</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {success && <div className="text-green-400 mb-4">{success}</div>}

      {!loading && admin && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-xl">
          <div className="mb-5">
            <label className="block mb-1 text-neutral-300">Name</label>
            <input
              type="text"
              value={admin.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:border-gold-400 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-1 text-neutral-300">Email</label>
            <input
              type="email"
              value={admin.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:border-gold-400 outline-none"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className={`px-5 py-2 rounded bg-gold-500 text-black font-semibold hover:bg-gold-400 transition ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      )}
    </div>
  );
}
