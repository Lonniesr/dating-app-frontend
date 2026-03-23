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

  if (isLoading || !profileUser) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  const photos = profileUser.photos ?? [];
  const age = calculateAge(profileUser.birthdate);

  return (
    <div className="p-6 text-white pb-28">

      {/* HEADER */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 flex justify-between items-center">

        <div className="flex gap-5">

          {/* PROFILE IMAGE + VERIFY */}
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

          {/* USER INFO */}
          <div className="flex flex-col justify-center">
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

            {/* ✅ EMAIL RESTORED */}
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

      {/* BIO */}
      {profileUser.bio && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
          <h2 className="font-semibold mb-2">Bio</h2>
          <p>{profileUser.bio}</p>
        </div>
      )}

      {/* PROMPTS */}
      {prompts.length > 0 && (
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
          <h2 className="font-semibold mb-4">Personality</h2>

          <div className="space-y-3">
            {prompts.map((p, i) => (
              <div key={i}>
                <p className="text-white/60 text-sm">{p.question}</p>
                <p className="font-medium">{p.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!viewingOtherUser && (
        <>
          <SwipeStatsSection />
          <MatchCountSection />

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
            <h2 className="font-semibold mb-4">Invites</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-white/50 text-sm">Sent</p>
                <p className="text-xl font-bold">
                  {profileUser?.invitesSent ?? 0}
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-white/50 text-sm">Accepted</p>
                <p className="text-xl font-bold text-green-400">
                  {profileUser?.invitesAccepted ?? 0}
                </p>
              </div>
            </div>
          </div>

          <PhotoManagerSection />
        </>
      )}

      {/* QR MODAL (UNCHANGED) */}
      {newInvite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl border border-white/10 text-center w-[360px]">

            <QRCodeSVG
              id="invite-qr"
              value={newInvite.inviteLink}
              size={260}
              level="H"
              includeMargin
              className="bg-white p-4 rounded-lg"
            />

            <img
              src={lynqlogo}
              className="absolute top-1/2 left-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
            />

          </div>
        </div>
      )}

    </div>
  );
}