import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";

import logo from "../assets/lynqlogo.png";

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

interface InviteStats {
  sent: number;
  joined: number;
}

export default function ProfilePage() {
  const { authUser, isLoading } = useUserAuth();
  const navigate = useNavigate();

  const [newInvite, setNewInvite] = useState<any | null>(null);

  const [inviteStats, setInviteStats] = useState<InviteStats>({
    sent: 0,
    joined: 0,
  });

  const createInviteMutation = useMutation({
    mutationFn: () => userInvitesService.create(),
    onSuccess: (invite) => {
      setNewInvite(invite);
    },
    onError: (err) => {
      console.error("Invite creation failed:", err);
    },
  });

  useEffect(() => {
    const loadInviteStats = async () => {
      try {
        const res = await apiClient.get("/api/invite/stats");
        setInviteStats(res.data);
      } catch (err) {
        console.error("Invite stats failed", err);
      }
    };

    loadInviteStats();
  }, []);

  const downloadQR = () => {
    const canvas = document.getElementById("invite-qr") as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `invite-${newInvite.code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <p className="text-white/60">Loading profile…</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="p-6 text-white">
        <p className="text-red-400">Unable to load profile.</p>
      </div>
    );
  }

  const photos = authUser.photos ?? [];

  return (
    <div className="p-6 text-white pb-28">

      <h1 className="text-2xl font-bold mb-6">
        My Profile
      </h1>

      {/* INVITE SECTION */}

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

      {/* PROFILE CARD */}

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
                {authUser.name}
              </p>

              {authUser.verified && (
                <span className="text-blue-400 text-sm font-semibold">
                  ✔ Verified
                </span>
              )}

              {authUser.gender && (
                <GenderIcon gender={authUser.gender} />
              )}

            </div>

            <p className="text-white/60">
              {authUser.email}
            </p>

            {/* Verification Status */}

            {!authUser.verified && authUser.verification_status === "none" && (
              <button
                onClick={() => navigate("/user/verify-selfie")}
                className="mt-2 text-sm text-yellow-400 hover:underline"
              >
                Verify your profile
              </button>
            )}

            {authUser.verification_status === "pending" && (
              <p className="text-sm text-yellow-400 mt-2">
                Verification pending review
              </p>
            )}

            {authUser.verification_status === "rejected" && (
              <button
                onClick={() => navigate("/user/verify-selfie")}
                className="text-sm text-red-400 hover:underline mt-2"
              >
                Verification rejected — try again
              </button>
            )}

          </div>

        </div>

      </div>

      {/* INVITE STATS */}

      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <h2 className="text-xl font-bold mb-4">
          Invite Impact
        </h2>

        <div className="grid grid-cols-2 gap-6 text-center">

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {inviteStats.sent}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Invites Sent
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {inviteStats.joined}
            </p>
            <p className="text-xs text-gray-400 uppercase">
              Friends Joined
            </p>
          </div>

        </div>

      </div>

      <SwipeStatsSection />
      <MatchCountSection />
      <SwipeActivityChart />

      {/* BIO */}

      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <h2 className="text-xl font-bold mb-2">
          Bio
        </h2>

        {authUser.bio ? (
          <p className="text-white/70">
            {authUser.bio}
          </p>
        ) : (
          <p className="text-white/50 text-sm">
            No bio added yet.
          </p>
        )}

      </div>

      <PhotoManagerSection>

      </PhotoManagerSection>

      {/* INVITE MODAL */}

      {newInvite && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 w-full max-w-md">

            <h2 className="text-xl font-bold mb-3">
              Invite Created
            </h2>

            <p className="mb-2">
              <strong>Code:</strong> {newInvite.code}
            </p>

            <p className="mb-4 break-all">
              <strong>Link:</strong>
              <br />
              <a
                href={newInvite.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400"
              >
                {newInvite.inviteLink}
              </a>
            </p>

            <div className="flex flex-col items-center gap-4 mb-4">

              <div className="bg-white p-4 rounded-lg border border-[#d4af37]">
                <QRCodeCanvas
                  id="invite-qr"
                  value={newInvite.inviteLink}
                  size={240}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin
                  imageSettings={{
                    src: logo,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>

              <button
                onClick={downloadQR}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
              >
                Download QR Code
              </button>

            </div>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() =>
                  navigator.clipboard.writeText(newInvite.inviteLink)
                }
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
              >
                Copy Link
              </button>

              <button
                onClick={shareInvite}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Share Invite
              </button>

              <button
                onClick={() => setNewInvite(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
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