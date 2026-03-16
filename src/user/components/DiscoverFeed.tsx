import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { useDiscover } from "../../hooks/useDiscover";
import { useSwipe } from "../hooks/useSwipe";
import { getProfilePhoto } from "../../utils/getProfilePhoto";
import apiClient from "../../services/apiClient";

const SWIPE_THRESHOLD = 120;

type DiscoverUser = {
  id: string;
  name: string;
  birthdate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
};

function calculateAge(birthdate?: string) {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 3958.8;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function DiscoverFeed() {

  const { data, isLoading } = useDiscover();
  const { swipe } = useSwipe();

  const [feed, setFeed] = useState<DiscoverUser[]>([]);
  const [busy, setBusy] = useState(false);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  useEffect(() => {
    if (data && data.length && feed.length === 0) {
      setFeed(data);
    }
  }, [data]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => console.warn("Location permission denied")
    );
  }, []);

  const current = feed[0];
  const next = feed[1];

  const photo = getProfilePhoto(current?.photos);
  const nextPhoto = getProfilePhoto(next?.photos);

  const age = calculateAge(current?.birthdate);

  const distance =
    location &&
    current?.latitude != null &&
    current?.longitude != null
      ? calculateDistance(
          location.lat,
          location.lon,
          current.latitude,
          current.longitude
        ).toFixed(1)
      : null;

  async function handleSwipe(direction: "left" | "right") {
    if (!current || busy) return;

    setBusy(true);

    swipe(current.id, direction === "right");

    const fly = direction === "right" ? 500 : -500;

    x.set(fly);

    setTimeout(() => {
      setFeed((prev) => prev.slice(1));
      x.set(0);
      setBusy(false);
    }, 160);
  }

  async function openProfile(userId: string) {
    try {
      const res = await apiClient.get(`/api/profile/${userId}`);
      setProfileData(res.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  }

  function closeProfile() {
    setSelectedUser(null);
    setProfileData(null);
  }

  if (isLoading) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">Loading people…</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">No more profiles.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">

      <div className="relative w-[380px] h-[520px]">

        {next && (
          <img
            src={nextPhoto}
            className="absolute w-full h-full object-cover rounded-2xl opacity-60 scale-95"
          />
        )}

        <motion.div
          key={current.id}
          className="absolute w-full h-full rounded-2xl overflow-hidden shadow-xl"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onDragEnd={() => {
            const offset = x.get();

            if (offset > SWIPE_THRESHOLD) handleSwipe("right");
            else if (offset < -SWIPE_THRESHOLD) handleSwipe("left");
            else x.set(0);
          }}
        >

          <img src={photo} className="w-full h-full object-cover" />

          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 text-green-400 text-3xl font-bold"
          >
            LIKE
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 text-red-400 text-3xl font-bold"
          >
            NOPE
          </motion.div>

          <div
            className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openProfile(current.id);
            }}
          >
            <h2 className="text-xl font-bold">
              {current.name}
              {age !== null && `, ${age}`}
            </h2>

            <p className="text-sm opacity-80">
              {current.location || "Unknown location"}
              {distance && ` • ${distance} miles away`}
            </p>

            <p className="text-xs opacity-60 mt-1">
              Tap to view profile
            </p>
          </div>

        </motion.div>

      </div>

      {/* SWIPE BUTTONS */}

      <div className="flex gap-6 mt-6">

        <button
          disabled={busy}
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-white/10 text-red-400 text-xl"
        >
          ✕
        </button>

        <button
          disabled={busy}
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full bg-white/10 text-blue-400 text-xl"
        >
          ★
        </button>

        <button
          disabled={busy}
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-white/10 text-green-400 text-xl"
        >
          ♥
        </button>

      </div>

      {/* PROFILE MODAL */}

      {selectedUser && profileData && (

        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">

          <button
            onClick={closeProfile}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div className="max-w-md mx-auto pt-16 pb-24 text-white">

            <div className="px-4 mb-6">

              <h2 className="text-2xl font-bold">
                {profileData.username || profileData.name}
                {profileData.age && `, ${profileData.age}`}
              </h2>

              {(profileData.location || profileData.latitude) && (
                <p className="text-white/60 mt-1">
                  {profileData.location || "Nearby"}
                </p>
              )}

              {profileData.bio && (
                <p className="mt-3 text-white/80">
                  {profileData.bio}
                </p>
              )}

            </div>

            {/* PROMPTS MOVED UP */}

            {Array.isArray(profileData.prompts) && profileData.prompts.length > 0 && (

              <div className="px-4 space-y-4 mb-6">

                {profileData.prompts.map((prompt: any, i: number) => (

                  <div
                    key={i}
                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                  >

                    <p className="text-xs text-white/50 mb-1">
                      {prompt.question}
                    </p>

                    <p className="text-white">
                      {prompt.answer}
                    </p>

                  </div>

                ))}

              </div>

            )}

            {/* PHOTOS */}

            {Array.isArray(profileData.photos) && (
              <div className="space-y-3 px-4">
                {profileData.photos.map((p: string, i: number) => (
                  <img
                    key={i}
                    src={getProfilePhoto([p])}
                    className="w-full rounded-xl"
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      )}

    </div>
  );
}