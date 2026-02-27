import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/useUserAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // 🔥 Refresh user AFTER login
      const user = await refreshUser();

      if (!user) {
        setError("Failed to load user");
        setLoading(false);
        return;
      }

      // 🎯 Conditional redirect
      if (!user.onboardingComplete) {
        navigate("/invite/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true }); // change if your main route differs
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-[#111] p-8 rounded-2xl shadow-xl border border-white/10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}