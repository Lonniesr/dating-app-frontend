import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface InviteData {
  premium?: boolean;
  invitedBy?: {
    username?: string;
    email?: string;
  };
  expiresAt?: string;
}

interface InviteError {
  message?: string;
  reason?: "expired" | "used" | "not_found";
}

export default function InviteLandingPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState<InviteError | null>(null);

  const fetchInvite = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invite/${code}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data);
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    } catch {
      setError({ message: "Server error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvite();
  }, [code]);

  const goToSignup = () => {
    navigate(`/signup?invite=${code}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading invite…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white px-6">
        <h1 className="text-3xl font-bold mb-4">Invite Issue</h1>

        {error.reason === "expired" && (
          <p className="text-red-400 text-lg mb-4">
            This invite has expired.
          </p>
        )}

        {error.reason === "used" && (
          <p className="text-red-400 text-lg mb-4">
            This invite has already been used.
          </p>
        )}

        {error.reason === "not_found" && (
          <p className="text-red-400 text-lg mb-4">
            This invite does not exist.
          </p>
        )}

        {!error.reason && (
          <p className="text-red-400 text-lg mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-white/10 px-4 py-2 rounded-lg text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white px-6">
      <div className="bg-[#111] p-8 rounded-2xl shadow-xl border border-white/10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">You're Invited</h1>

        {invite?.premium && (
          <div className="mb-3 text-yellow-400 font-semibold">
            Premium Invite ✨
          </div>
        )}

        {invite?.invitedBy && (
          <p className="text-white/70 mb-4">
            You were invited by{" "}
            <span className="text-white font-semibold">
              {invite.invitedBy.username || invite.invitedBy.email}
            </span>
          </p>
        )}

        {invite?.expiresAt && (
          <p className="text-white/50 text-sm mb-6">
            Expires on {new Date(invite.expiresAt).toLocaleDateString()}
          </p>
        )}

        <button
          onClick={goToSignup}
          className="w-full py-3 bg-yellow-500 text-black rounded-lg font-semibold text-lg"
        >
          Accept Invite
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 mt-3 bg-white/10 text-white rounded-lg"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
