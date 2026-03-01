import { useEffect, useState } from "react";
import { adminInvitesService } from "../services/adminInvitesService";

export default function AdminInvites() {
  const [invites, setInvites] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [premium, setPremium] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

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
    setEmail("");
    setPremium(false);
    setExpiresAt("");
  }

  return (
    <div style={{ color: "#fff" }}>
      <h1>Create Invite</h1>

      <div style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
        <label>
          Premium
          <input
            type="checkbox"
            checked={premium}
            onChange={(e) => setPremium(e.target.checked)}
          />
        </label>
        <button onClick={createInvite}>Create Invite</button>
      </div>

      <h2>Existing Invites</h2>
      {invites.map((invite) => (
        <div key={invite.id} style={{ marginBottom: "1rem" }}>
          <div>Code: {invite.code}</div>
          <div>
            Link:{" "}
            <a href={invite.inviteUrl} target="_blank">
              {invite.inviteUrl}
            </a>
          </div>
          <div>Used: {invite.used ? "Yes" : "No"}</div>
        </div>
      ))}
    </div>
  );
}