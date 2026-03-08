import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ChangePasswordSection() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updatePassword = async () => {
    if (!password) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl mb-6">

      <h2 className="text-xl font-bold mb-4">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 mb-3 rounded bg-white/10 border border-white/20"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={updatePassword}
        disabled={loading}
        className="px-4 py-2 bg-yellow-600 rounded-lg"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-white/70">
          {message}
        </p>
      )}

    </div>
  );
}