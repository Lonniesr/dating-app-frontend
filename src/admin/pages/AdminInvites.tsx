import { useEffect, useState } from "react";
import { adminInvitesService } from "../services/adminInvitesService";

export default function AdminInvites() {
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [createdInvite, setCreatedInvite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvites();
  }, []);

  async function loadInvites() {
    const data = await adminInvitesService.list();
    setInvites(data);
  }

  async function createInvite() {
    setLoading(true);
    const invite = await adminInvitesService.create({
      email,
      expiresAt,
      premium,
    });

    setInvites([invite, ...invites]);
    setCreatedInvite(invite);

    setEmail("");
    setPremium(false);
    setExpiresAt("");
    setLoading(false);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-14">

      {/* CREATE SECTION */}
      <div className="relative bg-gradient-to-br from-lynq-dark-2 to-lynq-dark p-10 rounded-3xl border border-lynq-gray-2 shadow-card backdrop-blur-sm">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />

        <h1 className="text-2xl font-semibold text-gold mb-8 tracking-wide">
          Create Invite
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none transition"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="date"
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none transition"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mt-8">
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
              className="accent-gold"
            />
            Premium Invite
          </label>

          <button
            onClick={createInvite}
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-gold text-black font-semibold transition hover:opacity-90 disabled:opacity-50 shadow-sm"
          >
            {loading ? "Generating..." : "Generate Invite"}
          </button>
        </div>
      </div>

      {/* EXISTING INVITES */}
      <div>
        <h2 className="text-xl font-semibold text-gold mb-8 tracking-wide">
          Existing Invites
        </h2>

        {invites.length === 0 && (
          <div className="text-gray-500 text-sm">
            No invites created yet.
          </div>
        )}

        <div className="space-y-6">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="bg-lynq-dark-2 p-8 rounded-3xl border border-lynq-gray-2 hover:border-gold/40 transition shadow-card"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Invite Code
                </div>

                <span
                  className={`text-xs px-4 py-1 rounded-full ${
                    invite.used
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {invite.used ? "Used" : "Active"}
                </span>
              </div>

              <div className="font-mono text-gold text-sm mb-3">
                {invite.code}
              </div>

              <div className="text-sm text-gray-400 break-all">
                {invite.inviteUrl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {createdInvite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-lynq-dark p-10 rounded-3xl border border-gold shadow-lg max-w-lg w-full space-y-8 animate-fadeSlide">
            <h2 className="text-2xl font-semibold text-gold tracking-wide">
              Invite Created
            </h2>

            <div>
              <div className="text-xs uppercase text-gray-500 mb-1">
                Invite Code
              </div>
              <div className="font-mono text-gold">
                {createdInvite.code}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-gray-500 mb-1">
                Invite URL
              </div>
              <div className="font-mono text-sm break-all">
                {createdInvite.inviteUrl}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  copyToClipboard(createdInvite.inviteUrl)
                }
                className="flex-1 bg-gold text-black py-3 rounded-2xl font-semibold transition hover:opacity-90"
              >
                Copy Link
              </button>

              <button
                onClick={() => setCreatedInvite(null)}
                className="flex-1 border border-lynq-gray-3 py-3 rounded-2xl hover:border-gold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}