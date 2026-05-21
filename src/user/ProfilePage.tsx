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

export default function ProfilePage() {
  const { id } = useParams();
  const { authUser, isLoading } = useUserAuth();
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<any>(null);
  const [newInvite, setNewInvite] = useState<any>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [canViewMap, setCanViewMap] = useState<Record<string, boolean>>({});

  const viewingOtherUser = !!id;

  const profileUser = viewingOtherUser
    ? otherUser ?? null
    : authUser;

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      const res = await apiClient.get(`/api/profile/${id}`);
      setOtherUser(res.data);
    };

    loadProfile();
  }, [id]);

  useEffect(() => {
    if (!viewingOtherUser && authUser?.prompts) {
      const p = authUser.prompts;

      if (Array.isArray(p)) {
        setPrompts(p);
      } else {
        const mapped = Object.entries(p).map(([question, answer]) => ({
          question,
          answer,
        }));
        setPrompts(mapped);
      }
    }
  }, [authUser, viewingOtherUser]);

  const photos = profileUser?.photos ?? [];
  const age = calculateAge(profileUser?.birthdate);

  useEffect(() => {
    const checkAccess = async () => {
      if (!viewingOtherUser) return;

      const results: Record<string, boolean> = {};

      for (const p of photos) {
        try {
          const id = typeof p === "string" ? p : p.id;

          const res = await apiClient.get(
            `/api/user/photo/can-view/${id}`
          );

          results[id] = res.data.canView;
        } catch {
          results[typeof p === "string" ? p : p.id] = false;
        }
      }

      setCanViewMap(results);
    };

    checkAccess();
  }, [photos, viewingOtherUser]);

  const createInviteMutation = useMutation({
    mutationFn: async () => {
      console.log("🔥 STARTING INVITE");

      const res = await userInvitesService.create();

      console.log("✅ INVITE RESPONSE:", res);

      return res;
    },

    onSuccess: (invite) => {
      console.log("✅ SUCCESS:", invite);
      setNewInvite(invite);
    },

    onError: (err) => {
      console.error("❌ INVITE ERROR:", err);
    },
  });

  if (isLoading) {
    return <div className="p-6 text-white">Loading…</div>;
  }

  if (!profileUser) {
    return <div className="p-6 text-white">No profile data</div>;
  }

  return (
    <div className="p-6 text-white pb-28">

      {/* HEADER */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 flex flex-col md:flex-row md:justify-between items-center gap-4">

        <div className="flex flex-col md:flex-row items-center gap-5 w-full">

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-white/10">

              {photos.length ? (() => {
                const raw = photos[0];

                const photoId = typeof raw === "string" ? raw : raw.id;
                const url =
                  typeof raw === "string"
                    ? resolvePhotoUrl(raw)
                    : resolvePhotoUrl(raw.url);

                const isPrivate =
                  typeof raw === "string" ? false : raw.isPrivate;

                const canView = !isPrivate || canViewMap[photoId];

                return (
                  <div className="w-full h-full relative">
                    <img
                      src={url}
                      className={`w-full h-full object-cover ${
                        isPrivate && !canView ? "blur-lg" : ""
                      }`}
                    />

                    {isPrivate && !canView && viewingOtherUser && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                        <p className="text-white text-xs mb-2">🔒 Private</p>

                        <button
                          onClick={async () => {
                            const message = prompt("Say something to request access:");
                            if (!message) return;

                            await apiClient.post("/api/user/photo/request", {
                              photoId,
                              message,
                            });

                            alert("Request sent 👀");
                          }}
                          className="bg-white text-black px-3 py-1 rounded text-xs"
                        >
                          Request Access
                        </button>
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div className="w-full h-full bg-white/10" />
              )}

            </div>

            {!viewingOtherUser && (
              <button
               onClick={() => navigate("/verify")} 
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
            type="button"
            onClick={() => {
              console.log("🔥 BUTTON CLICKED");
              createInviteMutation.mutate();
            }}
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

      {/* OWNER SECTIONS */}
      {!viewingOtherUser && (
        <>
          <SwipeStatsSection />
          <MatchCountSection />
          <PhotoManagerSection />
        </>
      )}

      {/* INVITE MODAL */}
      {newInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center relative">

            {/* CLOSE */}
            <button
              onClick={() => setNewInvite(null)}
              className="absolute top-3 right-3 text-white/60 hover:text-white text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-2">
              Invite Friends 🔥
            </h2>

            <p className="text-white/60 text-sm mb-5">
              Share your LynQ invite link
            </p>

            {/* QR */}
            <div className="bg-white p-4 rounded-xl inline-block mb-5">
              <QRCodeSVG
                value={newInvite.inviteLink}
                size={220}
                imageSettings={{
                  src: lynqlogo,
                  height: 50,
                  width: 50,
                  excavate: true,
                }}
              />
            </div>

            {/* LINK */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 mb-4 break-all text-sm text-blue-400">
              {newInvite.inviteLink}
            </div>

            {/* COPY */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(newInvite.inviteLink);
                alert("Invite copied 🔥");
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl mb-3"
            >
              Copy Invite Link
            </button>

            {/* SHARE */}
            <button
              type="button"
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: "Join me on LynQ 🔥",
                    text: "Here’s your invite to LynQ",
                    url: newInvite.inviteLink,
                  });
                } else {
                  navigator.clipboard.writeText(newInvite.inviteLink);
                  alert("Invite copied 🔥");
                }
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl"
            >
              Share Invite
            </button>

          </div>

        </div>
      )}

    </div>
  );
}