import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import logo from "../assets/lynqlogo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      /* Refresh authenticated user profile */

      const user = await refreshUser();

      if (!user) {
        setError("Failed to load user");
        return;
      }

      /*
        IMPORTANT:
        Always send user to onboarding first.
        Onboarding page will decide whether to resume
        onboarding or redirect to dashboard.
      */

      navigate("/invite/onboarding", { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-[#111] p-8 rounded-2xl shadow-xl border border-white/10 max-w-md w-full">

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
          <div className="mb-4 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 transition text-black rounded-lg font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Logging in…" : "Login"}
          </button>

        </div>

      </div>
    </div>
  );
}