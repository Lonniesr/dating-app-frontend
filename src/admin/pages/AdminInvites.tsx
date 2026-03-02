import { useEffect, useMemo, useState, useRef } from "react";
import { adminInvitesService } from "../services/adminInvitesService";
import { Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function AdminInvites() {
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [createdInvite, setCreatedInvite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  function downloadQR() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "invite-qr.png";
    a.click();
  }

  const filteredInvites = useMemo(() => {
    return invites
      .filter((invite) =>
        invite.code.toLowerCase().includes(search.toLowerCase())
      )
      .filter((invite) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active") return !invite.used;
        if (statusFilter === "used") return invite.used;
        return true;
      });
  }, [invites, search, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-16">

      {/* CREATE SECTION */}
      <div className="relative bg-gradient-to-br from-lynq-dark-2 to-lynq-dark p-10 rounded-3xl border border-lynq-gray-2 shadow-card">
        <h1 className="text-2xl font-semibold text-gold mb-8">
          Create Invite
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="date"
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none"
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
            className="px-8 py-3 rounded-2xl bg-gold text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Invite"}
          </button>
        </div>
      </div>

      {/* INVITE LIST */}
      <div className="space-y-6">
        {filteredInvites.map((invite) => (
          <div
            key={invite.id}
            className="bg-lynq-dark-2 p-8 rounded-3xl border border-lynq-gray-2 shadow-card"
          >
            <div className="flex justify-between">
              <div className="font-mono text-gold text-sm">
                {invite.code}
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
          </div>
        ))}
      </div>

      {/* SUCCESS MODAL WITH QR */}
      {createdInvite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-lynq-dark p-10 rounded-3xl border border-gold max-w-lg w-full space-y-8">
            <h2 className="text-2xl font-semibold text-gold">
              Invite Created
            </h2>

            <div className="font-mono text-gold">
              {createdInvite.code}
            </div>

            <div className="text-sm break-all">
              {createdInvite.inviteUrl}
            </div>

            <div
              ref={qrRef}
              className="flex justify-center bg-white p-4 rounded-xl"
            >
              <QRCodeCanvas
                value={createdInvite.inviteUrl}
                size={200}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  copyToClipboard(createdInvite.inviteUrl)
                }
                className="flex-1 bg-gold text-black py-3 rounded-2xl font-semibold"
              >
                Copy Link
              </button>

              <button
                onClick={downloadQR}
                className="flex-1 border border-lynq-gray-3 py-3 rounded-2xl hover:border-gold transition"
              >
                Download QR
              </button>
            </div>

            <button
              onClick={() => setCreatedInvite(null)}
              className="w-full border border-lynq-gray-3 py-3 rounded-2xl hover:border-gold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}