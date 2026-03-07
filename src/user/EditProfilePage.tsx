import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import apiClient from "../services/apiClient";

export default function EditProfilePage() {
  const { authUser } = useUserAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(authUser?.name || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [gender, setGender] = useState(authUser?.gender || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await apiClient.put("/api/user/profile", {
        name,
        bio,
        gender,
      });

      alert("Profile updated");

      navigate("/user/profile");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      <div className="space-y-6">

        {/* Name */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <label className="block text-sm text-white/60 mb-2">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
          />
        </div>

        {/* Bio */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <label className="block text-sm text-white/60 mb-2">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
          />
        </div>

        {/* Gender */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
          <label className="block text-sm text-white/60 mb-2">
            Gender
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nonbinary">Non-binary</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}