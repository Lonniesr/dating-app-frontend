import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import apiClient from "../services/apiClient";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import GenderIcon from "./components/GenderIcon";
import SwipeStatsSection from "./components/SwipeStatsSection";
import MatchCountSection from "./components/MatchCountSection";
import SwipeActivityChart from "./components/SwipeActivityChart";
import PhotoManagerSection from "./components/PhotoManagerSection";

function resolvePhotoUrl(photo: string) {
  if (!photo) return "";

  if (photo.startsWith("http")) {
    return photo;
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(photo);
  return data.publicUrl;
}

function calculateAge(birthdate?: string) {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age;
}

interface InviteStats {
  sent: number;
  joined: number;
}

interface Invite {
  code: string;
  inviteLink: string;
}

export default function ProfilePage() {

  const { id } = useParams();
  const { authUser, isLoading } = useUserAuth();

  const [otherUser, setOtherUser] = useState<any>(null);
  const [newInvite, setNewInvite] = useState<Invite | null>(null);
  const [prompts, setPrompts] = useState<any[]>([]);

  const [inviteStats, setInviteStats] = useState<InviteStats>({
    sent: 0,
    joined: 0,
  });

  const viewingOtherUser = !!id;
  const profileUser = viewingOtherUser ? otherUser : authUser;

  useEffect(() => {

    if (!id) {
      setOtherUser(null);
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await apiClient.get(`/api/profile/${id}`);
        setOtherUser(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    loadProfile();

  }, [id]);

  useEffect(() => {

    if (viewingOtherUser) return;

    if (Array.isArray(authUser?.prompts)) {
      setPrompts(authUser.prompts);
    } else {
      setPrompts([
        { question: "", answer: "" },
        { question: "", answer: "" },
        { question: "", answer: "" },
      ]);
    }

  }, [authUser, viewingOtherUser]);

  const createInviteMutation = useMutation({
    mutationFn: () => userInvitesService.create(),
    onSuccess: (invite: Invite) => {
      setNewInvite(invite);
    },
  });

  useEffect(() => {

    if (viewingOtherUser) return;

    const loadInviteStats = async () => {
      try {
        const res = await apiClient.get("/api/invite/stats");
        setInviteStats(res.data);
      } catch (err) {
        console.error("Invite stats failed", err);
      }
    };

    loadInviteStats();

  }, [viewingOtherUser]);

  const updatePrompt = (index: number, field: string, value: string) => {
    const updated = [...prompts];
    updated[index][field] = value;
    setPrompts(updated);
  };

  const addPrompt = () => {
    setPrompts([...prompts, { question: "", answer: "" }]);
  };

  const savePrompts = async () => {
    try {
      await apiClient.post("/api/profile/prompts", { prompts });
      alert("Prompts saved");
    } catch {
      alert("Failed to save prompts");
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("invite-qr") as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = `invite-${newInvite?.code}.png`;
    link.click();
  };

  if (isLoading || !profileUser) {
    return (
      <div className="p-6 text-white">
        <p className="text-white/60">Loading profile…</p>
      </div>
    );
  }

  const photos = profileUser.photos ?? [];
  const age = calculateAge(profileUser.birthdate);

  return (

    <div className="p-6 text-white pb-28">

      <h1 className="text-2xl font-bold mb-6">
        {viewingOtherUser ? "User Profile" : "My Profile"}
      </h1>

      {/* PROFILE HEADER */}

      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <div className="flex items-center gap-5">

          <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-white/10">
            {photos.length ? (
              <img
                src={resolvePhotoUrl(photos[0])}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          <div>

            <div className="flex items-center gap-2">

              <p className="font-bold text-xl">
                {profileUser.username || profileUser.name}
                {age && `, ${age}`}
              </p>

              {profileUser.verified && (
                <span className="text-blue-400 text-sm font-semibold">
                  ✔ Verified
                </span>
              )}

              {profileUser.gender && (
                <GenderIcon gender={profileUser.gender} />
              )}

            </div>

            {profileUser.location && (
              <p className="text-white/70 text-sm mt-1">
                {profileUser.location}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* PROMPT EDITOR */}

      {!viewingOtherUser && (

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

          <h2 className="text-lg font-semibold mb-4">
            Edit Prompts
          </h2>

          {prompts.map((p, i) => (

            <div key={i} className="mb-4">

              <input
                className="w-full bg-white/10 p-2 rounded mb-2"
                placeholder="Prompt question"
                value={p.question}
                onChange={(e) =>
                  updatePrompt(i, "question", e.target.value)
                }
              />

              <textarea
                className="w-full bg-white/10 p-2 rounded"
                placeholder="Your answer"
                value={p.answer}
                onChange={(e) =>
                  updatePrompt(i, "answer", e.target.value)
                }
              />

            </div>

          ))}

          <div className="flex gap-3">

            <button
              onClick={addPrompt}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              Add Prompt
            </button>

            <button
              onClick={savePrompts}
              className="bg-yellow-600 px-4 py-2 rounded font-semibold"
            >
              Save Prompts
            </button>

          </div>

        </div>

      )}

      {!viewingOtherUser && (
        <>

          <SwipeStatsSection />

          {/* INVITE PERFORMANCE */}

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 text-white">

            <h2 className="text-xl font-bold mb-3">
              Invite Performance
            </h2>

            <div className="space-y-1 text-white/80">

              <p>
                <strong>Invites Sent:</strong> {inviteStats.sent}
              </p>

              <p>
                <strong>Friends Joined:</strong> {inviteStats.joined}
              </p>

              <p>
                <strong>Conversion Rate:</strong>{" "}
                {inviteStats.sent > 0
                  ? `${Math.round((inviteStats.joined / inviteStats.sent) * 100)}%`
                  : "0%"}
              </p>

            </div>

          </div>

          <MatchCountSection />
          <SwipeActivityChart />
          <PhotoManagerSection />

        </>
      )}

      {newInvite && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-gray-900 p-6 rounded-xl border border-white/10 w-[320px] text-center">

            <QRCodeCanvas
              id="invite-qr"
              value={newInvite.inviteLink}
              size={180}
            />

            <p className="text-xs text-white/60 mt-3 break-all">
              {newInvite.inviteLink}
            </p>

            <button
              onClick={downloadQR}
              className="bg-purple-600 hover:bg-purple-700 py-2 rounded mt-4 w-full"
            >
              Download QR
            </button>

            <button
              onClick={() => setNewInvite(null)}
              className="bg-gray-700 hover:bg-gray-800 py-2 rounded mt-2 w-full"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}