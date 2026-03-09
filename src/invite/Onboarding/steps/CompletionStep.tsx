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

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding/complete`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Onboarding completion failed");
      }

      await refreshUser();

      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      navigate("/dashboard");

    } catch (err) {
      console.error("Onboarding completion failed:", err);
      alert("Something went wrong finishing onboarding.");
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
        disabled={loading}
        className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-lg disabled:opacity-50"
      >
        {loading ? "Finishing..." : "Go to Dashboard"}
      </button>
    </div>
  );
}