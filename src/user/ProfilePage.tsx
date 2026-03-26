import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import apiClient from "../services/apiClient";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import lynqlogo from "../assets/lynqlogo.png";

import GenderIcon from "./components/GenderIcon";
import SwipeStatsSection from "./components/SwipeStatsSection";
import MatchCountSection from "./components/MatchCountSection";
import PhotoManagerSection from "./components/PhotoManagerSection";

function resolvePhotoUrl(photo: string) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;

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

export default function ProfilePage() {
  const { id } = useParams();
  const { authUser, isLoading } = useUserAuth();

  const [otherUser, setOtherUser] = useState<any>(null);
  const [newInvite, setNewInvite] = useState<any>(null);
  const [prompts, setPrompts] = useState<any[]>([]);

  const viewingOtherUser = !!id;
  const profileUser = viewingOtherUser ? otherUser : authUser;

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      const res = await apiClient.get(`/api/profile/${id}`);
      setOtherUser(res.data);
    };

    loadProfile();
  }, [id]);

  useEffect(() => {
    if (!viewingOtherUser && Array.isArray(authUser?.prompts)) {
      setPrompts(authUser.prompts);
    }
  }, [authUser, viewingOtherUser]);

  const createInviteMutation = useMutation({
    mutationFn: () => userInvitesService.create(),
    onSuccess: (invite) => setNewInvite(invite),
  });

  const handleBlock = async () => {
    if (!id) return;

    const confirmBlock = window.confirm(
      "Block this user? You will no longer see or interact with them."
    );
    if (!confirmBlock) return;

    try {
      await apiClient.post("/api/block", { targetId: id });
      window.location.href = "/user";
    } catch (err) {
      console.error("Block failed", err);
    }
  };

  const handleReport = async () => {
    if (!id) return;

    const reason = prompt("Enter reason for report:");
    if (!reason) return;

    try {
      await apiClient.post("/api/report", {
        targetId: id,
        reason,
      });

      alert("Report submitted.");
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  if (isLoading || !profileUser) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  const photos = profileUser.photos ?? [];
  const age = calculateAge(profileUser.birthdate);

  return (
    <div className="p-6 text-white pb-28">

      {/* HEADER (FIXED ONLY) */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 flex flex-col md:flex-row md:justify-between items-center gap-4">

        <div className="flex flex-col md:flex-row items-center gap-5 w-full">

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-white/10">
              {photos.length ? (
                <img
                  src={resolvePhotoUrl(photos[0])}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>

            {!viewingOtherUser && (
              <button
                onClick={() => window.location.href = "/verify"}
                className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                Verify
              </button>
            )}
          </div>

          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <p className="font-bold text-xl">
                {profileUser.username || profileUser.name}
                {age && `, ${age}`}
              </p>

              {profileUser.verified && (
                <span className="text-blue-400 text-sm">✔</span>
              )}

              {profileUser.gender && (
                <GenderIcon gender={profileUser.gender} />
              )}
            </div>

            <p className="text-white/60 text-sm">
              {profileUser.email}
            </p>
          </div>

        </div>

        {!viewingOtherUser && (
          <button
            onClick={() => createInviteMutation.mutate()}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
          >
            Invite
          </button>
        )}

      </div>

      {/* INVITE MODAL (UNCHANGED FUNCTIONALLY) */}
      {newInvite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 p-6 rounded-xl border border-white/10 text-center w-full max-w-sm relative">

            <QRCodeSVG
              id="invite-qr"
              value={newInvite.inviteLink}
              size={220}
              level="H"
              includeMargin
              className="bg-white p-3 rounded-lg mx-auto"
            />

            <img
              src={lynqlogo}
              className="absolute top-[110px] left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            />

            <p className="mt-6 text-sm text-white/70 break-all">
              {newInvite.inviteLink}
            </p>

            <div className="mt-4 flex flex-col gap-2">

              <button
                onClick={() => {
                  navigator.clipboard.writeText(newInvite.inviteLink);
                  alert("Invite link copied!");
                }}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold w-full"
              >
                Copy Invite Link
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Join me on Lynq",
                      text: "Join me on Lynq",
                      url: newInvite.inviteLink,
                    });
                  } else {
                    alert("Sharing not supported on this device");
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold w-full"
              >
                Share Invite
              </button>

              <button
                onClick={() => {
                  const svg = document.getElementById("invite-qr");
                  if (!svg) return;

                  const serializer = new XMLSerializer();
                  const source = serializer.serializeToString(svg);

                  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
                  const url = URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "lynq-invite.svg";
                  link.click();

                  URL.revokeObjectURL(url);
                }}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold w-full"
              >
                Download QR
              </button>

              <button
                onClick={() => setNewInvite(null)}
                className="text-white/60 text-sm underline mt-1"
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