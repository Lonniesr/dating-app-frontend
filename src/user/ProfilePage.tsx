import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState, useEffect } from "react";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";
import apiClient from "../services/apiClient";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      setPrompts([]);
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

  const downloadQR = () => {
    const svg = document.getElementById("invite-qr");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `lynq-invite-${newInvite?.code}.svg`;
    link.click();
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(newInvite?.inviteLink || "");
    alert("Invite link copied");
  };

  const shareInvite = async () => {
    if (!newInvite?.inviteLink) return;

    if (navigator.share) {
      await navigator.share({
        title: "Join me on Lynq",
        text: "Use my invite to join Lynq",
        url: newInvite.inviteLink,
      });
    } else {
      copyInvite();
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

      {!viewingOtherUser && (
        <div className="mb-6 flex justify-end">
          <a
            href={`mailto:support@letslynq.com?subject=Issue%20Report&body=Page:${
              typeof window !== "undefined" ? window.location.pathname : ""
            }%0AUser:${authUser?.email || ""}%0A%0ADescribe your issue:`}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            Report an Issue
          </a>
        </div>
      )}

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

              {profileUser.verification_status === "pending" && (
                <span className="text-yellow-400 text-sm font-semibold">
                  ⏳ Pending
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

            {/* 🔥 SELFIE VERIFICATION BUTTON */}
            {!viewingOtherUser &&
              profileUser.verification_status !== "approved" && (
                <button
                  onClick={() => navigate("/user/verify-selfie")}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                >
                  Verify Your Profile
                </button>
              )}

          </div>

        </div>
      </div>

      {!viewingOtherUser && (
        <>
          <SwipeStatsSection />
          <MatchCountSection />
          <PhotoManagerSection />
        </>
      )}

      {newInvite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl border border-white/10 text-center w-[360px]">

            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Lynq
            </h2>

            <QRCodeSVG
              id="invite-qr"
              value={newInvite.inviteLink}
              size={260}
              level="H"
              includeMargin
              className="bg-white p-4 rounded-lg w-full"
            />

            <p className="text-xs text-white/60 mt-4 break-all">
              {newInvite.inviteLink}
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <button onClick={copyInvite} className="bg-blue-600 py-2 rounded font-semibold">
                Copy Link
              </button>
              <button onClick={shareInvite} className="bg-green-600 py-2 rounded font-semibold">
                Share
              </button>
              <button onClick={downloadQR} className="bg-purple-600 py-2 rounded font-semibold">
                Download QR
              </button>
              <button onClick={() => setNewInvite(null)} className="bg-gray-700 py-2 rounded">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}