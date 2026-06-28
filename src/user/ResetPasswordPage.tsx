import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/lynqlogo.png";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  async function handleSubmit() {
    if (loading) return;

    setError("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter and a number."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);

    } catch (err) {
      console.error(err);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">

          <img
            src={logo}
            alt="LynQ"
            className="w-36 mx-auto mb-6"
          />

          <div className="text-5xl mb-4">
            ✅
          </div>

          <h1 className="text-2xl font-semibold mb-3">
            Password Updated
          </h1>

          <p className="text-white/70 mb-8">
            Your password has been successfully updated.
            Redirecting to login...
          </p>

          <Link
            to="/login"
            className="block w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
          >
            Login Now
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="bg-[#111] border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md">

        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="LynQ"
            className="w-36 object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-center text-white/60 mb-8">
          Choose a new secure password.
        </p>

        {error && (
          <div className="mb-4 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-black font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-white/60 hover:text-white transition mt-4"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}