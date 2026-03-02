import { useEffect, useMemo, useState } from "react";
import { adminInvitesService } from "../services/adminInvitesService";
import { Copy } from "lucide-react";

export default function AdminInvites() {
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [createdInvite, setCreatedInvite] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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
      <div className="relative bg-gradient-to-br from-lynq-dark-2 to-lynq-dark p-10 rounded-3xl border border-lynq-gray-2 shadow-card transition-all duration-300 hover:shadow-xl">

        <div className="absolute -top-10 -right-10 w-60 h-60 bg-gold/5 rounded-full blur-3xl" />

        <h1 className="text-2xl font-semibold text-gold mb-8 tracking-wide">
          Create Invite
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none transition-all duration-200 focus:scale-[1.01]"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="date"
            className="bg-lynq-gray-2 p-4 rounded-2xl border border-lynq-gray-3 focus:border-gold outline-none transition-all duration-200 focus:scale-[1.01]"
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
            className="px-8 py-3 rounded-2xl bg-gold text-black font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Invite"}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        <h2 className="text-xl font-semibold text-gold tracking-wide">
          Existing Invites
        </h2>

        <div className="flex gap-4 w-full md:w-auto">

          <input
            placeholder="Search code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-lynq-gray-2 px-4 py-2 rounded-xl border border-lynq-gray-3 focus:border-gold outline-none text-sm w-full md:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-lynq-gray-2 px-4 py-2 rounded-xl border border-lynq-gray-3 focus:border-gold outline-none text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="used">Used</option>
          </select>
        </div>
      </div>

      {/* INVITE LIST */}
      <div className="space-y-6">
        {filteredInvites.map((invite) => (
          <div
            key={invite.id}
            className="bg-lynq-dark-2 p-8 rounded-3xl border border-lynq-gray-2 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 shadow-card group"
          >
            <div className="flex justify-between items-start">

              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Invite Code
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-mono text-gold text-sm">
                    {invite.code}
                  </div>

                  <Copy
                    size={16}
                    className="text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                    onClick={() => copyToClipboard(invite.inviteUrl)}
                  />
                </div>

                <div className="text-xs text-gray-400 mt-4 space-y-1">
                  <div>
                    Created: {new Date(invite.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    Expires:{" "}
                    {invite.expiresAt
                      ? new Date(invite.expiresAt).toLocaleDateString()
                      : "Never"}
                  </div>
                </div>
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

      {/* SUCCESS MODAL */}
      {createdInvite && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-lynq-dark p-10 rounded-3xl border border-gold shadow-lg max-w-lg w-full space-y-8 animate-fadeSlide">
            <h2 className="text-2xl font-semibold text-gold">
              Invite Created
            </h2>

            <div className="font-mono text-gold">
              {createdInvite.code}
            </div>

            <div className="text-sm break-all">
              {createdInvite.inviteUrl}
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