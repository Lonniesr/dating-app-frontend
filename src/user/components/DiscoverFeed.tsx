import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import { useDiscover } from "../../hooks/useDiscover";
import { useSwipe } from "../hooks/useSwipe";
import { getProfilePhoto } from "../../utils/getProfilePhoto";

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

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

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
  const { data, isLoading, refetch } = useDiscover();

  console.log("discover data:", data);

  const { swipe } = useSwipe();

  const users: DiscoverUser[] = Array.isArray(data)
    ? data
    : (data as any)?.profiles ?? [];

  const [index, setIndex] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  /* GET USER LOCATION */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        console.warn("Location permission denied");
      }
    );
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [users.length]);

  const current = users[index];
  const next = users[index + 1];

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

  function handleSwipe(direction: "left" | "right") {
    if (!current || swiping) return;

    setSwiping(true);

    swipe(current.id, direction === "right");

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      x.set(0);
      setSwiping(false);

      if (index + 1 >= users.length - 3) {
        refetch();
      }
    }, 200);
  }

  if (isLoading) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">Loading people…</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="h-[520px] flex items-center justify-center">
        <p className="text-white/60">No people found nearby.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">

      {/* CARD STACK */}

      <div className="relative w-[380px] h-[520px]">

        {next && (
          <motion.img
            src={nextPhoto}
            className="absolute w-full h-full object-cover rounded-2xl"
            initial={{ scale: 0.95, opacity: 0.6 }}
            animate={{ scale: 0.95, opacity: 0.6 }}
          />
        )}

        <AnimatePresence>
          {current && (
            <motion.div
              key={current.id}
              className="absolute w-full h-full rounded-2xl overflow-hidden shadow-xl"
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={() => {
                const offset = x.get();

                if (offset > SWIPE_THRESHOLD) {
                  handleSwipe("right");
                } else if (offset < -SWIPE_THRESHOLD) {
                  handleSwipe("left");
                } else {
                  x.set(0);
                }
              }}
            >
              <img
                src={photo}
                className="w-full h-full object-cover"
              />

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

              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-xl font-bold">
                  {current.name}
                  {age !== null && `, ${age}`}
                </h2>

                <p className="text-sm opacity-80">
                  {current.location || "Unknown location"}
                  {distance && ` • ${distance} miles away`}
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex gap-6 mt-6">

        {/* PASS */}
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-red-400 text-xl hover:bg-red-500/20"
        >
          ✕
        </button>

        {/* SUPER LIKE */}
        <button
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-blue-400 text-xl hover:bg-blue-500/20"
        >
          ★
        </button>

        {/* LIKE */}
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-green-400 text-xl hover:bg-green-500/20"
        >
          ♥
        </button>

      </div>

    </div>
  );
}