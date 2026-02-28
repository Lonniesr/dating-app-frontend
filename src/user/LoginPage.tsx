import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/useUserAuth";
import logo from "../assets/lynqlogo.png";
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
        return;
      }

      const user = await refreshUser();

      if (!user) {
        setError("Failed to load user");
        return;
      }

      if (!user.onboardingComplete) {
        navigate("/invite/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
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

        {/* 🔥 Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="LynQ Logo"
            className="w-36 object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-center tracking-wide">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-center">{error}</div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 transition text-black rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}