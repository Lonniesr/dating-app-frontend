import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import apiClient from "../services/apiClient";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { authUser } = useUserAuth();

  const [name, setName] = useState(authUser?.name || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [gender, setGender] = useState(authUser?.gender || "");

  const [interestedIn, setInterestedIn] = useState(
    authUser?.preferences?.interestedIn || ""
  );
  const [minAge, setMinAge] = useState(
    authUser?.preferences?.minAge || 18
  );
  const [maxAge, setMaxAge] = useState(
    authUser?.preferences?.maxAge || 40
  );
  const [locationRadius, setLocationRadius] = useState(
    authUser?.preferences?.locationRadius || 50
  );

  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    try {
      setLoading(true);

      await apiClient.put("/api/user/profile", {
        name,
        bio,
        gender,
        preferences: {
          interestedIn,
          minAge,
          maxAge,
          locationRadius
        }
      });

      navigate("/user/profile");

    } catch (err) {
      console.error("Profile update failed", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto pb-28">

      <h1 className="text-2xl font-bold mb-6">
        Edit Profile
      </h1>

      <div className="space-y-5">

        {/* NAME */}

        <div>
          <label className="text-sm text-white/70">
            Name
          </label>

          <input
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>


        {/* BIO */}

        <div>
          <label className="text-sm text-white/70">
            Bio
          </label>

          <textarea
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>


        {/* GENDER */}

        <div>
          <label className="text-sm text-white/70">
            Gender
          </label>

          <select
            className="w-full p-3 rounded bg-white/10 border border-white/20"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>


        {/* PREFERENCES */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <h2 className="font-semibold mb-4">
            Dating Preferences
          </h2>

          <div className="space-y-4">

            <div>
              <label className="text-sm text-white/70">
                Interested In
              </label>

              <select
                className="w-full p-3 rounded bg-white/10 border border-white/20"
                value={interestedIn}
                onChange={(e) => setInterestedIn(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>


            <div>
              <label className="text-sm text-white/70">
                Age Range
              </label>

              <div className="flex gap-3">

                <input
                  type="number"
                  value={minAge}
                  onChange={(e) =>
                    setMinAge(Number(e.target.value))
                  }
                  className="w-full p-3 rounded bg-white/10 border border-white/20"
                />

                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) =>
                    setMaxAge(Number(e.target.value))
                  }
                  className="w-full p-3 rounded bg-white/10 border border-white/20"
                />

              </div>
            </div>


            <div>
              <label className="text-sm text-white/70">
                Distance Radius (miles)
              </label>

              <input
                type="number"
                value={locationRadius}
                onChange={(e) =>
                  setLocationRadius(Number(e.target.value))
                }
                className="w-full p-3 rounded bg-white/10 border border-white/20"
              />
            </div>

          </div>

        </div>


        {/* SAVE BUTTON */}

        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}