import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const inviteCode = params.get("invite");

  const [name, setName] = useState(""); // ✅ Added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inviteCode) {
      setError("Missing invite code.");
    }
  }, [inviteCode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inviteCode) {
      setError("Invalid invite.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name, // ✅ Required by backend
            email,
            password,
            inviteCode, // ✅ Must match backend exactly
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }

      // Backend already sets httpOnly cookie
      navigate("/invite/onboarding"); // ✅ matches your router
    } catch {
      setError("Server error.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white px-6">
      <div className="bg-[#111] p-8 rounded-2xl shadow-xl border border-white/10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Your Account
        </h1>

        {inviteCode && (
          <p className="text-center text-white/60 mb-4">
            Signing up with invite:{" "}
            <span className="text-yellow-400 font-semibold">
              {inviteCode}
            </span>
          </p>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 mt-4 bg-white/10 text-white rounded-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}