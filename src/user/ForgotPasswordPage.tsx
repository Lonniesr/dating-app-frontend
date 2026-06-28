import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/lynqlogo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (loading) return;

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      // Always show success to prevent email enumeration
      setSent(true);
    } catch (err) {
      console.error(err);

      // Still show success for security
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">

          <img
            src={logo}
            alt="LynQ"
            className="w-36 mx-auto mb-6"
          />

          <div className="text-5xl mb-4">
            📧
          </div>

          <h1 className="text-2xl font-semibold mb-3">
            Check your email
          </h1>

          <p className="text-white/70 leading-relaxed mb-8">
            If an account exists for that email address,
            we've sent instructions to reset your password.
          </p>

          <Link
            to="/login"
            className="block w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
          >
            Return to Login
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
          Forgot Password?
        </h1>

        <p className="text-white/60 text-center mb-8">
          Enter the email associated with your LynQ account.
        </p>

        {error && (
          <div className="mb-4 text-center text-red-400">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          to="/login"
          className="block text-center mt-6 text-sm text-white/60 hover:text-white transition"
        >
          Back to Login
        </Link>

      </div>
    </div>
  );
}