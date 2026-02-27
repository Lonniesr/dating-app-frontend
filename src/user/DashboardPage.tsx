import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/useUserAuth";

export default function DashboardPage() {
  const { authUser } = useUserAuth();
  const navigate = useNavigate();

  const prefs = authUser?.preferences;

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-400">
        Welcome, {authUser?.name || "User"}
      </h1>

      {/* ---------------- PREFERENCES ---------------- */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Preferences</h2>

          <button
            onClick={() => navigate("/user/settings")}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:opacity-90 transition"
          >
            Edit
          </button>
        </div>

        {prefs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Interested In
              </p>
              <p className="font-medium mt-1">
                {prefs.interestedIn || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Age Range
              </p>
              <p className="font-medium mt-1">
                {prefs.minAge ?? "?"} – {prefs.maxAge ?? "?"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Race Preference
              </p>
              <p className="font-medium mt-1">
                {prefs.racePreference || "No preference"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide">
                Distance
              </p>
              <p className="font-medium mt-1">
                {prefs.locationRadius === null ||
                prefs.locationRadius === undefined
                  ? "Any distance"
                  : `${prefs.locationRadius} miles`}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            You haven’t set preferences yet.
            <button
              onClick={() => navigate("/user/settings")}
              className="ml-2 text-yellow-400 hover:underline"
            >
              Set them now
            </button>
          </div>
        )}
      </section>

      {/* ---------------- DISCOVER ---------------- */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-2">Discover</h2>
        <p className="text-gray-400">No more people right now.</p>
      </section>

      {/* ---------------- MATCHES ---------------- */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-2">Your Matches</h2>
        <p className="text-gray-400">No matches yet.</p>
      </section>

      {/* ---------------- MESSAGES ---------------- */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        <p className="text-gray-400">No recent messages.</p>
      </section>
    </div>
  );
}