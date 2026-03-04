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

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-white/60 tracking-wide">
          Validating invite...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="bg-[#111] p-10 rounded-3xl border border-red-500/20 max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-red-400">
            Invite Issue
          </h1>

          {error.reason === "expired" && (
            <p className="text-red-300">
              This invite has expired.
            </p>
          )}

          {error.reason === "used" && (
            <p className="text-red-300">
              This invite has already been used.
            </p>
          )}

          {error.reason === "not_found" && (
            <p className="text-red-300">
              This invite does not exist.
            </p>
          )}

          {!error.reason && (
            <p className="text-red-300">
              {error.message || "Something went wrong."}
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-white/10 hover:bg-white/20 transition rounded-xl"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     SUCCESS STATE
  ========================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0d0d0f] to-black text-white px-6">
      <div className="bg-[#111] p-10 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full text-center space-y-6">

        {/* Brand */}
        <h1 className="text-3xl font-bold">
          Welcome to <span className="text-yellow-400">LynQ</span>
        </h1>

        <div className="text-xs uppercase tracking-widest text-white/50">
          Private • Invite Only
        </div>

        {/* Premium Badge */}
        {invite?.premium && (
          <div className="inline-block bg-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full text-xs font-semibold">
            Premium Access ✨
          </div>
        )}

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed">
          You’ve been invited to join a totally free, organically growing
          community built around real connections — not algorithms.
          Every invite expands the network.
        </p>

        {/* Inviter */}
        {invite?.invitedBy && (
          <p className="text-white/60 text-sm">
            Invited by{" "}
            <span className="text-white font-semibold">
              {invite.invitedBy.username || invite.invitedBy.email}
            </span>
          </p>
        )}

        {/* Expiration */}
        {invite?.expiresAt && (
          <p className="text-white/40 text-xs">
            Expires {new Date(invite.expiresAt).toLocaleDateString()}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={goToSignup}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 transition rounded-xl font-semibold text-black text-lg shadow-lg"
        >
          Accept Invite
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 bg-white/5 hover:bg-white/10 transition rounded-xl text-sm"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}