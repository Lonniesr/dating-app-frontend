import { useEffect, useState } from "react";
import { adminInvitesService } from "../services/adminInvitesService";

export default function AdminInvites() {
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [createdInvite, setCreatedInvite] = useState<any | null>(null);

  useEffect(() => {
    loadInvites();
  }, []);

  async function loadInvites() {
    const data = await adminInvitesService.list();
    setInvites(data);
  }

  async function createInvite() {
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
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* CREATE CARD */}
      <div className="bg-lynq-dark-2 p-8 rounded-2xl shadow-card border border-lynq-gray-2">
        <h1 className="text-2xl font-semibold text-gold mb-6">
          Create Invite
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="bg-lynq-gray-2 p-3 rounded-xl border border-lynq-gray-3 focus:border-gold outline-none"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="date"
            className="bg-lynq-gray-2 p-3 rounded-xl border border-lynq-gray-3 focus:border-gold outline-none"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center gap-2 text-sm">
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
            className="bg-gold text-black px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition shadow-gold"
          >
            Generate Invite
          </button>
        </div>
      </div>

      {/* EXISTING INVITES */}
      <div>
        <h2 className="text-xl font-semibold text-gold mb-6">
          Existing Invites
        </h2>

        <div className="space-y-4">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="bg-lynq-dark-2 p-6 rounded-2xl border border-lynq-gray-2 shadow-card"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gold font-mono text-sm">
                  {invite.code}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    invite.used
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {invite.used ? "Used" : "Active"}
                </span>
              </div>

              <div className="text-sm break-all text-gray-300">
                {invite.inviteUrl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {createdInvite && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-lynq-dark p-8 rounded-2xl border border-gold shadow-gold max-w-lg w-full space-y-6 animate-fadeSlide">
            <h2 className="text-2xl text-gold font-semibold">
              Invite Created ✨
            </h2>

            <div>
              <div className="text-sm text-gray-400 mb-1">Code</div>
              <div className="font-mono text-gold">
                {createdInvite.code}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Invite URL</div>
              <div className="font-mono text-sm break-all">
                {createdInvite.inviteUrl}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() =>
                  copyToClipboard(createdInvite.inviteUrl)
                }
                className="flex-1 bg-gold text-black py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Copy Link
              </button>

              <button
                onClick={() => setCreatedInvite(null)}
                className="flex-1 border border-lynq-gray-3 py-2 rounded-xl hover:border-gold transition"
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