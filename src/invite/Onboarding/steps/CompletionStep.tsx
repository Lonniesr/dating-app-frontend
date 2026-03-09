import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUserAuth } from "../../../user/context/UserAuthContext";

export default function CompletionStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshUser } = useUserAuth();

  const [loading, setLoading] = useState(false);

  const finish = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding/complete`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });

      // Refresh auth user so profile data immediately appears
      await refreshUser();

      // Optional: clear cached queries
      await queryClient.invalidateQueries();

      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding completion failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">You're All Set!</h1>

      <p className="text-white/70 mb-6">
        Your profile is ready. Welcome aboard.
      </p>

      <button
        onClick={finish}
        className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-lg"
      >
        {loading ? "Finishing..." : "Go to Dashboard"}
      </button>
    </div>
  );
}