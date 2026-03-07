import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";

import logo from "../assets/lynqlogo.png";

import GenderIcon from "./components/GenderIcon";
import SwipeStatsSection from "./components/SwipeStatsSection";
import MatchCountSection from "./components/MatchCountSection";
import SwipeActivityChart from "./components/SwipeActivityChart";
import ProfileCompletionSection from "./components/ProfileCompletionSection";
import PhotoManagerSection from "./components/PhotoManagerSection";
import type { Preferences } from "./context/UserAuthContext";

function resolvePhotoUrl(photo: string) {
  if (!photo) return "";

  if (photo.startsWith("http")) {
    return photo;
  }

  const { data } = supabase.storage.from("photos").getPublicUrl(photo);
  return data.publicUrl;
}

export default function ProfilePage() {
  const { authUser, isLoading } = useUserAuth();
  const [newInvite, setNewInvite] = useState<any | null>(null);

  const createInviteMutation = useMutation({
    mutationFn: () => userInvitesService.create(),
    onSuccess: (invite) => {
      setNewInvite(invite);
    },
    onError: (err) => {
      console.error("Invite creation failed:", err);
    },
  });

  const formatPreferences = (prefs: Preferences) => {
    return `${prefs.interestedIn} • Ages ${prefs.minAge}-${prefs.maxAge} • Radius ${prefs.locationRadius}mi`;
  };

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
    <div className="p-6 text-white">

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">

        <Link
          to="/user/edit-profile"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          Edit Profile
        </Link>

        <Link
          to="/user/settings"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg font-semibold"
        >
          Settings
        </Link>

      </div>

      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <div className="flex items-center gap-5 mb-4">

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
              <p className="font-bold text-xl">{authUser.name}</p>

              {authUser.verified && (
                <span className="text-blue-400 text-sm font-semibold">
                  ✔ Verified
                </span>
              )}

              {authUser.gender && <GenderIcon gender={authUser.gender} />}
            </div>

            <p className="text-white/60">{authUser.email}</p>

          </div>

        </div>

        <div className="space-y-2 text-white/70">
          <p>
            <strong>Preferences:</strong>{" "}
            {authUser.preferences
              ? formatPreferences(authUser.preferences)
              : "—"}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => createInviteMutation.mutate()}
            disabled={createInviteMutation.isPending}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition rounded-lg font-semibold disabled:opacity-50"
          >
            {createInviteMutation.isPending ? "Creating…" : "Generate Invite"}
          </button>
        </div>

      </div>

      <PhotoManagerSection />
      <ProfileCompletionSection />
      <SwipeStatsSection />
      <MatchCountSection />
      <SwipeActivityChart />

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
                    excavate: true
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
                  newInvite.inviteLink &&
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