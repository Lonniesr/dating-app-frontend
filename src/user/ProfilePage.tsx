import { useMutation } from "@tanstack/react-query";
import { userInvitesService } from "./services/userInvitesService";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "./context/UserAuthContext";
import { supabase } from "../lib/supabaseClient";

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
  });

  const formatPreferences = (prefs: Preferences) => {
    return `${prefs.interestedIn} • Ages ${prefs.minAge}-${prefs.maxAge} • Radius ${prefs.locationRadius}mi`;
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

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      {/* EDIT PROFILE */}
      <Link
        to="/edit-profile"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
      >
        Edit Profile
      </Link>

      {/* PROFILE CARD */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <div className="flex items-center gap-5 mb-4">

          {/* MAIN PHOTO */}
          <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 bg-white/10">
            {photos.length ? (
              <img
                src={resolvePhotoUrl(photos[0])}
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          {/* NAME + VERIFIED + GENDER ICON */}
          <div>

            <div className="flex items-center gap-2">

              <p className="font-bold text-xl">
                {authUser.name}
              </p>

              {/* VERIFIED BADGE */}
              {authUser.verified && (
                <span className="text-blue-400 text-sm font-semibold">
                  ✔ Verified
                </span>
              )}

              {/* GENDER ICON */}
              {authUser.gender && (
                <GenderIcon gender={authUser.gender} />
              )}

            </div>

            <p className="text-white/60">
              {authUser.email}
            </p>

          </div>

        </div>

        {/* PROFILE DETAILS */}
        <div className="space-y-2 text-white/70">

          <p>
            <strong>Preferences:</strong>{" "}
            {authUser.preferences
              ? formatPreferences(authUser.preferences)
              : "—"}
          </p>

        </div>

        {/* INVITE BUTTON */}
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

      {/* PHOTO GALLERY */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <h2 className="text-xl font-bold mb-4">Photos</h2>

        {photos.length ? (
          <div className="grid grid-cols-3 gap-3">

            {photos.map((photo, index) => (
              <img
                key={index}
                src={resolvePhotoUrl(photo)}
                alt="User photo"
                className="rounded-lg object-cover h-32 w-full"
                loading="lazy"
              />
            ))}

          </div>
        ) : (
          <p className="text-white/50 text-sm">
            No photos uploaded yet.
          </p>
        )}

      </div>

      {/* BIO */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">

        <h2 className="text-xl font-bold mb-2">Bio</h2>

        {authUser.bio ? (
          <p className="text-white/70">{authUser.bio}</p>
        ) : (
          <p className="text-white/50 text-sm">
            No bio added yet.
          </p>
        )}

      </div>

      {/* PHOTO MANAGER */}
      <PhotoManagerSection />

      <ProfileCompletionSection />
      <SwipeStatsSection />
      <MatchCountSection />
      <SwipeActivityChart />

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

            <div className="flex gap-3">

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