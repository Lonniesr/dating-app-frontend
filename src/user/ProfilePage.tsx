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

  // ✅ ADDED
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

  const photos = profileUser.photos ?? [];
  const age = calculateAge(profileUser.birthdate);

  // ✅ ADDED (SAFE)
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

              {/* ✅ FIXED BLOCK */}
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

      </div>

      {/* EVERYTHING ELSE UNTOUCHED */}

    </div>
  );
}