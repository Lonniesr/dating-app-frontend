import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import apiClient from "../services/apiClient";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<any>(null);
  const [newInvite, setNewInvite] = useState<Invite | null>(null);

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

  const createInviteMutation = useMutation({
    mutationFn: () => userInvitesService.create(),
    onSuccess: (invite: Invite) => {
      setNewInvite(invite);
    },
    onError: (err) => {
      console.error("Invite creation failed:", err);
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

  const downloadQR = () => {
    const canvas = document.getElementById("invite-qr") as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = `invite-${newInvite?.code}.png`;
    link.click();
  };

  const shareInvite = async () => {
    if (!newInvite?.inviteLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me on Lynq",
          text: "Use my invite to join Lynq.",
          url: newInvite.inviteLink,
        });
      } else {
        navigator.clipboard.writeText(newInvite.inviteLink);
        alert("Invite link copied");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
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

            {!viewingOtherUser && profileUser.email && (
              <p className="text-white/60 text-sm">
                {profileUser.email}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* OWNER ONLY */}

      {!viewingOtherUser && (

        <>
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

            <div className="flex justify-between items-center">

              <h2 className="text-lg font-semibold">
                Invite Friends
              </h2>

              <button
                onClick={() => createInviteMutation.mutate()}
                disabled={createInviteMutation.isPending}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold disabled:opacity-50"
              >
                {createInviteMutation.isPending
                  ? "Creating..."
                  : "Generate Invite"}
              </button>

            </div>

          </div>

          <SwipeStatsSection />
          <MatchCountSection />
          <SwipeActivityChart />
          <PhotoManagerSection />

        </>

      )}

      {/* INVITE MODAL */}

      {newInvite && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-gray-900 p-6 rounded-xl border border-white/10 w-[320px] text-center">

            <h2 className="text-lg font-semibold mb-4">
              Invite Friends
            </h2>

            <QRCodeCanvas
              id="invite-qr"
              value={newInvite.inviteLink}
              size={180}
            />

            <p className="text-xs text-white/60 mt-3 break-all">
              {newInvite.inviteLink}
            </p>

            <div className="flex flex-col gap-2 mt-4">

              <button
                onClick={() => navigator.clipboard.writeText(newInvite.inviteLink)}
                className="bg-blue-600 hover:bg-blue-700 py-2 rounded"
              >
                Copy Link
              </button>

              <button
                onClick={downloadQR}
                className="bg-purple-600 hover:bg-purple-700 py-2 rounded"
              >
                Download QR
              </button>

              <button
                onClick={shareInvite}
                className="bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Share
              </button>

              <button
                onClick={() => setNewInvite(null)}
                className="bg-gray-700 hover:bg-gray-800 py-2 rounded"
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